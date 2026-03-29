"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateRestaurantSettings } from "@/lib/actions/restaurant";
import Image from "next/image";
import { RotateCcw, Image as ImageIcon, Eye, EyeOff, UploadCloud } from "lucide-react";

const defaultColors = {
  primary_color: "#f97316",
  bg_color: "#F8F9FA",
  card_bg_color: "#ffffff",
  text_primary_color: "#111827",
  text_secondary_color: "#6B7280",
};

export default function SettingsForm({ restaurant }: { restaurant: any }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showCover, setShowCover] = useState(restaurant?.show_cover !== false);

  useEffect(() => {
    if (restaurant) {
      setShowCover(restaurant.show_cover !== false);
    }
  }, [restaurant?.show_cover]);

  const resetToDefaults = () => {
    if (confirm("هل أنت متأكد من استعادة الألوان الافتراضية؟")) {
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
    <form
      action={async (fd) => {
        setLoading(true);
        const res = await updateRestaurantSettings(fd);
        if (res.success) {
          alert("تم التحديث بنجاح!");
          router.refresh();
        } else {
          alert(res.error);
        }
        setLoading(false);
      }}
      className="space-y-8"
    >
      {/* القسم المدمج للصور */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* لوجو المطعم - تصميم ثابت */}
        <div className="relative group p-6 border-2 border-dashed border-gray-200 rounded-3xl bg-white hover:border-orange-200 transition-all flex flex-col items-center gap-4">
          <span className="absolute -top-3 right-6 bg-white px-2 text-xs font-bold text-gray-500">لوجو المطعم</span>
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center border">
            {restaurant?.logo ? (
              <Image src={restaurant.logo} alt="Logo" fill className="object-contain p-2" />
            ) : (
              <ImageIcon className="text-gray-300" size={40} />
            )}
          </div>
          <input type="hidden" name="currentLogo" value={restaurant?.logo || ""} />
          <label className="flex items-center gap-2 cursor-pointer bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors">
            <UploadCloud size={16} />
            رفع لوجو جديد
            <input type="file" name="logo" accept="image/*" className="hidden" />
          </label>
        </div>

        {/* غلاف الهيرو - التصميم الجديد المدمج */}
        <div className={`relative flex flex-col rounded-3xl transition-all duration-500 border-2 ${showCover ? 'border-blue-100 bg-blue-50/20' : 'border-gray-100 bg-gray-50/50 opacity-80'}`}>
          <div className="p-4 flex justify-between items-center border-b border-inherit">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${showCover ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                {showCover ? <Eye size={16} /> : <EyeOff size={16} />}
              </div>
              <span className={`text-sm font-bold ${showCover ? 'text-green-700' : 'text-gray-500'}`}>
                صورة الغلاف (Hero)
              </span>
            </div>
            
            {/* الزر التفاعلي الجديد */}
            <button 
              type="button"
              onClick={() => setShowCover(!showCover)}
              className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${showCover ? 'bg-white border-blue-200 text-blue-600 shadow-sm' : 'bg-gray-200 border-gray-300 text-gray-600'}`}
            >
              {showCover ? "إخفاء الغلاف" : "تفعيل الغلاف"}
            </button>
            <input type="hidden" name="show_cover" value={showCover ? "true" : "false"} />
          </div>

          <div className="p-5 flex flex-col items-center justify-center min-h-[160px]">
            {showCover ? (
              <div className="w-full space-y-4 animate-in zoom-in-95 duration-300">
                <div className="relative w-full h-24 rounded-2xl overflow-hidden bg-white border border-blue-100">
                  {restaurant?.cover_image ? (
                    <Image src={restaurant.cover_image} alt="Cover" fill className="object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <ImageIcon size={24} className="mb-1" />
                      <span className="text-[10px]">لم يتم اختيار صورة بعد</span>
                    </div>
                  )}
                </div>
                <input type="hidden" name="currentCover" value={restaurant?.cover_image || ""} />
                <label className="flex items-center justify-center gap-2 cursor-pointer bg-white border border-blue-200 text-blue-600 w-full py-2 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all">
                  <UploadCloud size={16} />
                  تغيير الصورة
                  <input type="file" name="cover_image" accept="image/*" className="hidden" />
                </label>
              </div>
            ) : (
              <div className="text-center space-y-2 opacity-60">
                <p className="text-xs font-medium text-gray-500">الغلاف معطل حالياً</p>
                <p className="text-[10px] text-gray-400 max-w-[150px]">سيظهر اللوجو فقط في أعلى المنيو بشكل بسيط</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- باقي الألوان والبيانات (بدون تغيير في المنطق، فقط تحسين بسيط في المظهر) --- */}
      <div className="p-6 border border-gray-100 rounded-[2rem] bg-gray-50/30 space-y-6">
        <div className="flex justify-between items-center">
          <button type="button" onClick={resetToDefaults} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-orange-600 transition-colors">
            <RotateCcw size={14} />
            استعادة الألوان الأصلية
          </button>
          <h3 className="font-bold text-gray-800">الألوان والهوية</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: "primary_color", label: "الأزرار والحواف" },
            { name: "bg_color", label: "الخلفية" },
            { name: "card_bg_color", label: "البطاقات" },
            { name: "text_primary_color", label: "العناوين" },
            { name: "text_secondary_color", label: "الوصف" },
          ].map((color) => (
            <div key={color.name} className="flex items-center justify-between bg-white p-2 px-3 rounded-2xl border border-gray-100 shadow-sm">
              <input 
                type="color" 
                name={color.name} 
                defaultValue={restaurant?.[color.name] || defaultColors[color.name as keyof typeof defaultColors]} 
                className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" 
              />
              <label className="text-[11px] font-bold text-gray-600">{color.label}</label>
            </div>
          ))}
        </div>
      </div>

      {/* حقول البيانات */}
      <div className="grid gap-5">
        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-700 mr-2">اسم المنشأة</label>
          <input name="name" defaultValue={restaurant?.name || ""} className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-orange-500 transition-all text-right" required />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-400 mr-2 italic">رابط المنيو الخاص بك</label>
          <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-2xl p-4 opacity-70" dir="ltr">
            <span className="text-gray-400 font-bold">/r/</span>
            <input name="slug" defaultValue={restaurant?.slug || ""} readOnly className="w-full bg-transparent outline-none text-gray-600 font-semibold" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-700 mr-2">رقم الواتساب للطلبات</label>
          <input name="whatsapp" defaultValue={restaurant?.whatsapp || ""} placeholder="9665xxxxxxxx" className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-orange-500 transition-all text-left" required />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className={`w-full py-5 rounded-[2rem] font-black text-lg transition-all transform active:scale-[0.98] ${loading ? 'bg-gray-300' : 'bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-orange-100'}`}
      >
        {loading ? "جاري الحفظ..." : "تحديث إعدادات المنيو"}
      </button>
    </form>
  );
}