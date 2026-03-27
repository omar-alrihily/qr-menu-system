import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { Restaurant } from "@/models/Restaurant";
import SettingsForm from "./SettingsForm"; // سننشئ هذا المكون الآن
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  await dbConnect();
  const restaurant = await Restaurant.findById(session.user.id).lean();
  
  // تحويل البيانات لـ JSON بسيط
  const data = JSON.parse(JSON.stringify(restaurant));

  return (
    <div className="max-w-2xl mx-auto" dir="rtl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">إعدادات المطعم</h1>
        <p className="text-gray-500">تحكم في معلومات مطعمك ورابط المنيو واللوجو</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <SettingsForm restaurant={data} />
      </div>
    </div>
  );
}