"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateRestaurantSettings } from "@/lib/actions/restaurant";
import Image from "next/image";
import { 
  RotateCcw, 
  Image as ImageIcon, 
  Eye, 
  EyeOff, 
  UploadCloud,
  CheckCircle2, 
  AlertCircle, 
  MessageCircle 
} from "lucide-react";

const defaultColors = {
  primary_color: "#f97316",
  bg_color: "#F8F9FA",
  card_bg_color: "#ffffff",
  text_primary_color: "#111827",
  text_secondary_color: "#6B7280",
};

export default function SettingsForm({ restaurant, subStatus }: { restaurant: any, subStatus: any }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // التعديل 1: تغيير القيمة الافتراضية لتكون false (مخفية)
  const [showCover, setShowCover] = useState(restaurant?.show_cover === true);

  useEffect(() => {
    if (restaurant) {
      // التعديل 2: التأكد من قراءة القيمة من الداتابيز وإلا تكون false
      setShowCover(restaurant.show_cover === true);
    }
  }, [restaurant?.show_cover]);

  const getWhatsAppLink = () => {
    const message = `مرحباً، أرغب في تجديد اشتراكي في فليكس منيو.%0Aاسم المطعم: ${restaurant.name}%0Aالبريد: ${restaurant.email}`;
    return `https://wa.me/9665XXXXXXXX?text=${message}`; 
  };

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
    // التعديل 3: إضافة pb-24 لضمان وجود مساحة كافية للتمرير فوق منيو الجوال
    <div className="space-y-10 pb-24">
      
      {/* 1. قسم حالة الاشتراك */}
      <div className={`p-6 rounded-3xl border-2 transition-all ${subStatus?.allowed ? 'border-emerald-100 bg-emerald-50/30' : 'border-red-100 bg-red-50/30'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${subStatus?.allowed ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
              {subStatus?.allowed ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            </div>
            <div>
              <h3 className="font-black text-slate-900 leading-tight font-[tajawal]">
                حالة الحساب: {subStatus?.status === 'trial' ? 'فترة تجريبية' : subStatus?.allowed ? 'مفعل' : 'منتهي'}
              </h3>
              <p className="text-xs font-bold text-slate-500 mt-1 font-[tajawal]">
                {subStatus?.allowed 
                  ? `ينتهي خلال ${subStatus.daysLeft} يوم` 
                  : 'يرجى التجديد لاستعادة صلاحيات التحكم'}
              </p>
            </div>
          </div>
          
          <a 
            href={getWhatsAppLink()} 
            target="_blank"
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl text-sm font-black hover:bg-emerald-600 transition-all shadow-lg active:scale-95 font-[tajawal]"
          >
            <MessageCircle size={18} />
            تجديد الاشتراك الآن
          </a>
        </div>
      </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* لوجو المطعم */}
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

          {/* غلاف الهيرو */}
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
              <button 
                type="button"
                onClick={() => setShowCover(!showCover)}
                className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${showCover ? 'bg-white border-blue-200 text-blue-600 shadow-sm' : 'bg-gray-200 border-gray-300 text-gray-600'}`}
              >
                {showCover ? "إخفاء" : "تفعيل"}
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
                        <span className="text-[10px]">لم يتم اختيار صورة</span>
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
                <div className="text-center opacity-60">
                  <p className="text-[10px] text-gray-400 max-w-[150px]">الغلاف معطل حالياً</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* الألوان */}
        <div className="p-6 border border-gray-100 rounded-[2rem] bg-gray-50/30 space-y-6">
          <div className="flex justify-between items-center">
            <button type="button" onClick={resetToDefaults} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-orange-600 transition-colors">
              <RotateCcw size={14} />
              الألوان الأصلية
            </button>
            <h3 className="font-bold text-gray-800">الألوان</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { name: "primary_color", label: "الأساسي" },
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
            <label className="block text-sm font-bold text-gray-700 mr-2">رقم الواتساب للطلبات</label>
            <input name="whatsapp" defaultValue={restaurant?.whatsapp || ""} placeholder="9665xxxxxxxx" className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-orange-500 transition-all text-left" required />
            <input type="hidden" name="slug" value={restaurant?.slug} />
          </div>
        </div>

        {/* التعديل 4: تحسين الزر ليكون واضحاً دائماً */}
        <div className="sticky bottom-20 z-10 sm:static sm:pb-0">
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-5 rounded-[2rem] font-black text-lg transition-all transform active:scale-[0.95] shadow-2xl ${loading ? 'bg-gray-300' : 'bg-green-600 hover:bg-green-700 text-white'}`}
          >
            {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
          </button>
        </div>
      </form>
    </div>
  );
}