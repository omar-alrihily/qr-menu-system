"use client"
import { registerRestaurant } from "../../lib/actions/auth"; // حسب موقع الصفحة

export default function Register() {
  return (
    <form action={async (formData) => {
        const res = await registerRestaurant(formData);
        if(res.success) alert("تم إنشاء الحساب، يمكنك الدخول الآن");
    }} className="flex flex-col gap-4 max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold">إنشاء حساب مطعم جديد</h1>
      <input name="name" placeholder="اسم المطعم" className="border p-2 rounded" required />
      <input name="email" type="email" placeholder="البريد الإلكتروني" className="border p-2 rounded" required />
      <input name="slug" placeholder="رابط المطعم (مثلاً: my-pizza)" className="border p-2 rounded" required />
      <input name="whatsapp" placeholder="رقم الواتساب" className="border p-2 rounded" required />
      <input name="password" type="password" placeholder="كلمة المرور" className="border p-2 rounded" required />
      <button className="bg-green-600 text-white p-2 rounded">إنشاء حساب</button>
    </form>
  );
}