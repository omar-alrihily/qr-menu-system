"use server"
import { Resend } from 'resend';
import dbConnect from "@/lib/dbConnect";
import { Restaurant } from "@/models/Restaurant";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
 * تسجيل مطعم جديد مع تفعيل فترة تجربة 30 يوماً تلقائياً
 */
// داخل دالة registerRestaurant في ملف lib/actions/auth.ts

export async function registerRestaurant(formData: FormData) {
  try {
    await dbConnect();

    // 1. فحص الفخ (Honeypot Check)
    // إذا كان هذا الحقل ممتلئاً، فهذا يعني أن بوتاً قام بتعبئة الفورم آلياً
    const honeyField = formData.get("confirm_restaurant_email_field");
    if (honeyField && honeyField.toString().length > 0) {
      console.warn("Bot registration attempt blocked via Honeypot.");
      // نعيد نجاح وهمي لإيهام البوت بأن عمليته تمت بنجاح فلا يكرر المحاولة
      return { success: true }; 
    }

    const email = (formData.get("email") as string).toLowerCase();
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const slug = (formData.get("slug") as string).toLowerCase(); 
    const whatsapp = formData.get("whatsapp") as string;

    // 2. تحقق من البريد الإلكتروني
    const existingEmail = await Restaurant.findOne({ email });
    if (existingEmail) return { success: false, error: "هذا البريد الإلكتروني مسجل مسبقاً" };

    // 3. تحقق من الرابط (Slug)
    const existingSlug = await Restaurant.findOne({ slug });
    if (existingSlug) return { success: false, error: "رابط المنيو هذا محجوز بالفعل، اختر اسماً آخر" };

    // تشفير كلمة المرور (عملية تستهلك موارد السيرفر، لذا فحص البوت قبلها مهم جداً)
    const hashedPassword = await bcrypt.hash(password, 10);

    const TRIAL_DAYS = 30;
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DAYS);

    await Restaurant.create({
      name,
      email,
      password: hashedPassword,
      slug,
      whatsapp,
      plan: 'free',
      subscriptionStatus: 'trial',
      trialEndsAt: trialEndsAt,
      isBlocked: false
    });

    return { success: true };
  } catch (error) {
    console.error("Register Error:", error);
    return { success: false, error: "حدث خطأ أثناء الإنشاء، يرجى التأكد من البيانات" };
  }
}
/**
 * دالة للتحقق من صلاحية اشتراك المطعم (سنستخدمها في لوحة التحكم والمنيو)
 */
export async function checkSubscriptionStatus(restaurantId: string) {
  try {
    await dbConnect();
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) return { status: 'not_found', allowed: false };
    if (restaurant.isBlocked) return { status: 'blocked', allowed: false };

    const now = new Date();
    
    // تحديد تاريخ النهاية بناءً على الحالة (تجريبي أو اشتراك مدفوع)
    const expirationDate = restaurant.subscriptionStatus === 'trial' 
      ? restaurant.trialEndsAt 
      : restaurant.subscriptionEndsAt;

    // إذا لم يوجد تاريخ انتهاء (حالة نادرة) أو انتهى التاريخ
    if (!expirationDate || now > expirationDate) {
      return { 
        status: 'expired', 
        allowed: false, 
        plan: restaurant.plan,
        message: "انتهى اشتراكك، يرجى التجديد للاستمرار" 
      };
    }

    // حساب الأيام المتبقية للتنبيه
    const diffTime = expirationDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return { 
      status: 'active', 
      allowed: true, 
      daysLeft, 
      isTrial: restaurant.subscriptionStatus === 'trial' 
    };

  } catch (error) {
    return { status: 'error', allowed: false };
  }
}

// --- بقية الدوال (إعادة تعيين كلمة المرور) تبقى كما هي ---

const resend = new Resend(process.env.RESEND_API_KEY);
export async function forgotPassword(email: string) {
  try {
    await dbConnect();
    const user = await Restaurant.findOne({ email: email.toLowerCase() });

    // 1. الأمان: لا تخبر البوت إذا كان الإيميل موجوداً أم لا
    if (!user) {
      return { success: true, message: "إذا كان البريد مسجلاً، ستصلك رسالة قريباً" };
    }

    // 2. حماية من الإغراق (Rate Limiting):
    // إذا كان هناك توكن تم إنشاؤه ولم تمر عليه ساعة، لا ترسل إيميل جديد
    const now = new Date();
    if (user.resetPasswordExpires && user.resetPasswordExpires > now) {
      // نحسب الفرق بالدقائق لنعرف متى طلب الإيميل الأخير
      const diffInMinutes = Math.floor((user.resetPasswordExpires.getTime() - now.getTime()) / 60000);
      
      // إذا كان الوقت المتبقي أكثر من 0، فهذا يعني أن هناك طلب نشط حالياً
      // نرجع نجاح وهمي لنخدع البوت ونحمي السيرفر
      if (diffInMinutes > 0) {
        return { success: true, message: "إذا كان البريد مسجلاً، ستصلك رسالة قريباً" };
      }
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // تحديث التوكن ووقت انتهاء الصلاحية (ساعة واحدة من الآن)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); 
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${resetToken}`;

    // 3. إرسال الإيميل عبر Resend
    const { error } = await resend.emails.send({
      from: 'Reset Password <noreply@flexm.pro>',
      to: user.email,
      subject: 'إعادة تعيين كلمة المرور - فليكس منيو', // عدلت الاسم ليتناسب مع مشروعك الحالي
      html: `
        <div dir="rtl" style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333;">طلب إعادة تعيين كلمة المرور</h2>
          <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك في <strong>فليكس منيو</strong>.</p>
          <p>إذا لم تكن أنت من قام بهذا الطلب، يرجى تجاهل هذا الإيميل.</p>
          <div style="margin: 30px 0;">
            <a href="${resetUrl}" style="background: #0f172a; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 12px; font-weight: bold;">إعادة تعيين كلمة المرور</a>
          </div>
          <p style="font-size: 12px; color: #666;">هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
        </div>
      `
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, message: "فشل إرسال البريد الإلكتروني" };
    }

    return { success: true, message: "تم إرسال الرابط بنجاح" };
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return { success: false, message: "حدث خطأ غير متوقع" };
  }
}
export async function resetPassword(token: string, newPassword: string) {
  try {
    await dbConnect();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await Restaurant.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return { success: false, message: "الرابط غير صالح أو انتهت صلاحيته" };

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { success: true, message: "تم تحديث كلمة المرور بنجاح" };
  } catch (error) {
    return { success: false, message: "حدث خطأ أثناء التحديث" };
  }
}



// أضف هذه الدالة في lib/actions/auth.ts

export async function renewSubscription(restaurantId: string, days: number = 30) {
  try {
    await dbConnect();
    
    const newEndDate = new Date();
    newEndDate.setDate(newEndDate.getDate() + days);

    await Restaurant.findByIdAndUpdate(restaurantId, {
      subscriptionStatus: 'active', // نحوله من trial إلى active
      subscriptionEndsAt: newEndDate,
      plan: days > 31 ? 'yearly' : 'monthly',
      isBlocked: false
    });

    return { success: true, message: `تم التجديد لمدة ${days} يوم بنجاح` };
  } catch (error) {
    return { success: false, message: "فشل التجديد" };
  }
}