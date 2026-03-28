"use client";
import { useState } from "react";
import { updateRestaurantSettings } from "@/lib/actions/restaurant";
import Image from "next/image";

export default function SettingsForm({ restaurant }: { restaurant: any }) {
  const [loading, setLoading] = useState(false);

  return (
    <form action={async (fd) => {
      setLoading(true);
      const res = await updateRestaurantSettings(fd);
      if (res.success) alert("تم التحديث بنجاح!");
      else alert(res.error);
      setLoading(false);
    }} className="space-y-8">

      {/* قسم الصور: اللوجو والغلاف */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* رفع اللوجو */}
        <div className="flex flex-col items-center gap-4 p-4 border rounded-2xl bg-gray-50/50">
          <label className="text-sm font-bold text-gray-600">لوجو المطعم</label>
          <div className="relative w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden bg-white flex items-center justify-center">
            {restaurant.logo ? (
              <Image src={restaurant.logo} alt="Logo" fill className="object-contain" />
            ) : (
              <span className="text-gray-400 text-xs text-center p-2">لا يوجد لوجو</span>
            )}
          </div>
          <input type="hidden" name="currentLogo" value={restaurant.logo} />
          <label className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-50 transition">
            تغيير اللوجو
            <input type="file" name="logo" accept="image/*" className="hidden" />
          </label>
        </div>

        {/* رفع صورة الغلاف */}
        <div className="flex flex-col items-center gap-4 p-4 border rounded-2xl bg-gray-50/50">
          <label className="text-sm font-bold text-gray-600">صورة غلاف المنيو</label>
          <div className="relative w-full h-32 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden bg-white flex items-center justify-center">
            {restaurant.cover_image ? (
              <Image src={restaurant.cover_image} alt="Cover" fill className="object-cover" />
            ) : (
              <span className="text-gray-400 text-xs text-center p-2">لا توجد صورة غلاف</span>
            )}
          </div>
          <input type="hidden" name="currentCover" value={restaurant.cover_image} />
          <label className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-50 transition">
            تغيير الغلاف
            <input type="file" name="cover_image" accept="image/*" className="hidden" />
          </label>
        </div>
      </div>

      {/* قسم تخصيص الألوان */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border rounded-2xl bg-blue-50/30">
        <div className="col-span-full border-b pb-2 mb-2">
          <h3 className="text-right font-bold text-gray-700">ألوان الهوية (Theme)</h3>
        </div>
        
        <div className="flex items-center justify-between bg-white p-3 rounded-xl border">
          <input 
            type="color" 
            name="primary_color" 
            defaultValue={restaurant.primary_color || "#f97316"} 
            className="w-12 h-12 rounded-lg cursor-pointer border-none"
          />
          <label className="text-sm font-medium text-gray-700 text-right">اللون الأساسي (الأزرار والعناوين)</label>
        </div>

        <div className="flex items-center justify-between bg-white p-3 rounded-xl border">
          <input 
            type="color" 
            name="bg_color" 
            defaultValue={restaurant.bg_color || "#F8F9FA"} 
            className="w-12 h-12 rounded-lg cursor-pointer border-none"
          />
          <label className="text-sm font-medium text-gray-700 text-right">لون خلفية المنيو</label>
        </div>
      </div>

      {/* البيانات الأساسية */}
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">اسم المطعم</label>
          <input name="name" defaultValue={restaurant.name} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-right" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1 text-right italic underline">رابط المنيو (ثابت)</label>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 opacity-70 cursor-not-allowed" dir="ltr">
            <span className="text-gray-400 font-bold">/r/</span>
            <input name="slug" defaultValue={restaurant.slug} readOnly className="w-full bg-transparent outline-none text-gray-600 font-semibold cursor-not-allowed" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">رقم الواتساب</label>
          <input name="whatsapp" defaultValue={restaurant.whatsapp} placeholder="9665xxxxxxxx" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-left" required />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className={`w-full py-4 rounded-xl font-bold text-white transition-all ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100'}`}
      >
        {loading ? "جاري الحفظ..." : "حفظ وتحديث المنيو"}
      </button>
    </form>
  );
}