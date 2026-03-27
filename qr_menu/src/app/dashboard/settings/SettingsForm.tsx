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
    }} className="space-y-6">
      
      {/* عرض اللوجو الحالي */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="relative w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
          {restaurant.logo ? (
            <Image src={restaurant.logo} alt="Logo" fill className="object-contain" />
          ) : (
            <span className="text-gray-400 text-xs text-center p-2">لا يوجد لوجو حالياً</span>
          )}
        </div>
        <input type="hidden" name="currentLogo" value={restaurant.logo} />
        <label className="bg-blue-50 text-green-400 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-100 transition">
           تغيير اللوجو
           <input type="file" name="logo" accept="image/*" className="hidden" />
        </label>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">اسم المطعم</label>
          <input name="name" defaultValue={restaurant.name} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-right" required />
        </div>

       <div>
  <label className="block text-sm font-medium text-gray-400 mb-1 text-right italic">
    رابط المنيو (لا يمكن تغييره بعد التسجيل)
  </label>
  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 opacity-70 cursor-not-allowed" dir="ltr">
    <span className="text-gray-400 font-bold">/r/</span>
    <input 
      name="slug" 
      defaultValue={restaurant.slug} 
      readOnly 
      className="w-full bg-transparent outline-none text-gray-600 font-semibold cursor-not-allowed" 
    />
  </div>
</div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">رقم الواتساب (بدون +)</label>
          <input name="whatsapp" defaultValue={restaurant.whatsapp} placeholder="9665xxxxxxxx" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-left" required />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className={`w-full py-4 rounded-xl font-bold text-white transition-all ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-blue-100'}`}
      >
        {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
      </button>
    </form>
  );
}