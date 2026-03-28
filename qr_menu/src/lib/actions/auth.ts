"use server"
import { Resend } from 'resend';
import dbConnect from "@/lib/dbConnect";
import { Restaurant } from "@/models/Restaurant";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function registerRestaurant(formData: FormData) {
  try {
    await dbConnect();
    
    const email = (formData.get("email") as string).toLowerCase();
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;

    // تحقق بسيط قبل البدء
    const existing = await Restaurant.findOne({ email });
    if (existing) return { success: false, message: "البريد الإلكتروني مسجل مسبقاً" };

    const hashedPassword = await bcrypt.hash(password, 10);

    await Restaurant.create({
      name,
      email,
      password: hashedPassword,
      slug,
      whatsapp: formData.get("whatsapp")
    });

    return { success: true };
  } catch (error) {
    console.error("Register Error:", error);
    return { success: false, message: "حدث خطأ أثناء الإنشاء، تأكد من البيانات" };
  }
}


const resend = new Resend(process.env.RESEND_API_KEY);

// دالة طلب إعادة تعيين كلمة المرور
export async function forgotPassword(email: string) {
  try {
    await dbConnect();
    const user = await Restaurant.findOne({ email: email.toLowerCase() });

    if (!user) {
      return { success: true, message: "إذا كان البريد مسجلاً، ستصلك رسالة قريباً" };
    }

    // توليد وتشفير التوكن
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // صلاحية لمدة ساعة
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${resetToken}`;

    // إرسال الإيميل عبر Resend
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // استخدم هذا الإيميل طالما أنت في الوضع المحلي
      to: user.email, // سيصل فقط للإيميل الذي سجلت به في Resend حالياً
      subject: 'إعادة تعيين كلمة المرور - منصة مرغوب',
      html: `
        <div dir="rtl" style="font-family: sans-serif;">
          <h2>طلب إعادة تعيين كلمة المرور</h2>
          <p>لقد طلبت إعادة تعيين كلمة المرور لحسابك في منصة مرغوب.</p>
          <p>يرجى الضغط على الرابط أدناه لتغيير كلمة المرور (صالح لمدة ساعة واحدة):</p>
          <a href="${resetUrl}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">إعادة تعيين كلمة المرور</a>
          <p>إذا لم تطلب هذا التغيير، يرجى تجاهل هذا الإيميل.</p>
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

    // تشفير التوكن القادم من الرابط للبحث عنه
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await Restaurant.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // التأكد أن التوكن لم ينتهِ
    });

    if (!user) {
      return { success: false, message: "الرابط غير صالح أو انتهت صلاحيته" };
    }

    // تشفير كلمة المرور الجديدة
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // مسح بيانات التوكن لعدم استخدامها مرة أخرى
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    return { success: true, message: "تم تحديث كلمة المرور بنجاح، سيتم توجيهك لصفحة الدخول" };
  } catch (error) {
    console.error("Reset Password Error:", error);
    return { success: false, message: "حدث خطأ أثناء التحديث" };
  }
}