"use server"
import { Resend } from 'resend';
import dbConnect from "@/lib/dbConnect";
import { Restaurant } from "@/models/Restaurant";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
 * تسجيل مطعم جديد مع تفعيل فترة تجربة 30 يوماً تلقائياً
 */
export async function registerRestaurant(formData: FormData) {
  try {
    await dbConnect();
    
    const email = (formData.get("email") as string).toLowerCase();
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const whatsapp = formData.get("whatsapp") as string;

    // تحقق من وجود الحساب مسبقاً
    const existing = await Restaurant.findOne({ email });
    if (existing) return { success: false, message: "البريد الإلكتروني مسجل مسبقاً" };

    const hashedPassword = await bcrypt.hash(password, 10);

    // --- منطق الاشتراك الجديد ---
    const TRIAL_DAYS = 30;
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DAYS); // إضافة 30 يوم من تاريخ اليوم

    await Restaurant.create({
      name,
      email,
      password: hashedPassword,
      slug,
      whatsapp,
      // الحقول الجديدة التي أضفناها للـ Schema
      plan: 'free',
      subscriptionStatus: 'trial',
      trialEndsAt: trialEndsAt,
      isBlocked: false
    });

    return { success: true };
  } catch (error) {
    console.error("Register Error:", error);
    return { success: false, message: "حدث خطأ أثناء الإنشاء، تأكد من البيانات" };
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

    if (!user) {
      return { success: true, message: "إذا كان البريد مسجلاً، ستصلك رسالة قريباً" };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); 
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${resetToken}`;

    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: 'إعادة تعيين كلمة المرور - منصة مرغوب',
      html: `
        <div dir="rtl" style="font-family: sans-serif;">
          <h2>طلب إعادة تعيين كلمة المرور</h2>
          <p>لقد طلبت إعادة تعيين كلمة المرور لحسابك في منصة مرغوب.</p>
          <a href="${resetUrl}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">إعادة تعيين كلمة المرور</a>
        </div>
      `
    });

    if (error) return { success: false, message: "فشل إرسال البريد الإلكتروني" };
    return { success: true, message: "تم إرسال الرابط بنجاح" };
  } catch (error) {
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