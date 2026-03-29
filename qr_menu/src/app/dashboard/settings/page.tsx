import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { Restaurant } from "@/models/Restaurant";
import SettingsForm from "./SettingsForm";
import { redirect } from "next/navigation";
import { checkSubscriptionStatus } from "@/lib/actions/auth"; // استدعاء دالة الفحص

export const revalidate = 0;

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  await dbConnect();
  
  // البحث عن المطعم باستخدام البريد الإلكتروني لضمان الدقة
  const restaurant = await Restaurant.findOne({ email: session.user?.email }).lean();
  
  if (!restaurant) redirect("/login");

  // فحص حالة الاشتراك الحالية (تجريبي، منتهي، مفعل)
  const statusResult = await checkSubscriptionStatus(restaurant._id.toString());
  
  // تحويل البيانات لـ JSON بسيط لتفادي أخطاء الدوال (Functions) في الكلينت كومبوننت
  const data = JSON.parse(JSON.stringify(restaurant));
  const subStatus = JSON.parse(JSON.stringify(statusResult));

  return (
    <div className="max-w-2xl mx-auto" dir="rtl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 font-[tajawal]">إعدادات المطعم والاشتراك</h1>
        <p className="text-gray-500 font-[tajawal]">تحكم في معلومات مطعمك، الهوية البصرية، وتابع حالة اشتراكك</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        {/* نمرر الـ subStatus الجديد كـ Prop للمكون */}
        <SettingsForm restaurant={data} subStatus={subStatus} />
      </div>
    </div>
  );
}