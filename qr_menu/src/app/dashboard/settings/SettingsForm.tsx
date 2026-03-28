"use client";
import { useState } from "react";
import { updateRestaurantSettings } from "@/lib/actions/restaurant";
import Image from "next/image";
import { RotateCcw } from "lucide-react"; // أيقونة الاستعادة

// 1. تعريف الألوان الافتراضية للنظام
const defaultColors = {
  primary_color: "#f97316",
  bg_color: "#F8F9FA",
  card_bg_color: "#ffffff",
  text_primary_color: "#111827",
  text_secondary_color: "#6B7280",
};

export default function SettingsForm({ restaurant }: { restaurant: any }) {
  const [loading, setLoading] = useState(false);

  // 2. دالة استعادة الألوان الافتراضية في الواجهة
  const resetToDefaults = () => {
    if (confirm("هل أنت متأكد من رغبتك في استعادة الألوان الافتراضية؟ (لن يتم الحفظ إلا بعد ضغط زر التحديث)")) {
      const colorInputs = document.querySelectorAll('input[type="color"]');
      colorInputs.forEach((input: any) => {
        const name = input.name as keyof typeof defaultColors;
        if (defaultColors[name]) {
          input.value = defaultColors[name];
        }
      });
    }
  };

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

      {/* قسم تخصيص الألوان المطور */}
      <div className="p-6 border rounded-2xl bg-blue-50/30 space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          {/* زر الرجوع للألوان الافتراضية */}
          <button 
            type="button" 
            onClick={resetToDefaults}
            className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 bg-white px-3 py-2 rounded-lg border border-blue-100 shadow-sm transition-all active:scale-95"
          >
            <RotateCcw size={14} />
            استعادة الافتراضي
          </button>
          <div className="text-right">
            <h3 className="font-bold text-gray-700">تخصيص ألوان المنيو (Theme)</h3>
            <p className="text-xs text-gray-500 mt-1">تحكم في كامل الهوية البصرية لمتجرك</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border">
            <input type="color" name="primary_color" defaultValue={restaurant.primary_color || defaultColors.primary_color} className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent" />
            <label className="text-xs font-bold text-gray-700 text-right">لون الأزرار و الحواف</label>
          </div>

          <div className="flex items-center justify-between bg-white p-3 rounded-xl border">
            <input type="color" name="bg_color" defaultValue={restaurant.bg_color || defaultColors.bg_color} className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent" />
            <label className="text-xs font-bold text-gray-700 text-right">لون خلفية الصفحة</label>
          </div>

          <div className="flex items-center justify-between bg-white p-3 rounded-xl border">
            <input type="color" name="card_bg_color" defaultValue={restaurant.card_bg_color || defaultColors.card_bg_color} className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent" />
            <label className="text-xs font-bold text-gray-700 text-right">لون صناديق المنتجات</label>
          </div>

          <div className="flex items-center justify-between bg-white p-3 rounded-xl border">
            <input type="color" name="text_primary_color" defaultValue={restaurant.text_primary_color || defaultColors.text_primary_color} className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent" />
            <label className="text-xs font-bold text-gray-700 text-right"> لون خط العناوين للأقسام والمنتجات</label>
          </div>

          <div className="flex items-center justify-between bg-white p-3 rounded-xl border">
            <input type="color" name="text_secondary_color" defaultValue={restaurant.text_secondary_color || defaultColors.text_secondary_color} className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent" />
            <label className="text-xs font-bold text-gray-700 text-right">لون خط الوصف للمنتجات</label>
          </div>
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