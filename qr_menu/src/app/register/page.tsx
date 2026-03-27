"use client";

import { registerRestaurant } from "../../lib/actions/auth";
import { useState } from "react";
import Link from "next/link";
import { Store, Mail, Link as LinkIcon, Phone, Lock, CheckCircle2, Loader2 } from "lucide-react";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleAction(formData: FormData) {
    setLoading(true);
    const res = await registerRestaurant(formData);
    setLoading(false);
    
    if (res.success) {
      setSuccess(true);
    } else {
      alert("حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى");
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-center font-sans" dir="rtl">
        <div className="bg-slate-900/50 p-10 rounded-[2rem] border border-emerald-500/20 backdrop-blur-xl max-w-sm w-full shadow-2xl shadow-emerald-500/5 transition-all animate-in zoom-in-95">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">تم إنشاء الحساب!</h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">مطعمك الآن جاهز للتحول الرقمي. يمكنك تسجيل الدخول والبدء فوراً.</p>
          <Link href="/login" className="block w-full py-3.5 bg-emerald-500 text-black font-black rounded-xl hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/10">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col justify-center py-12 px-6 lg:px-8 font-sans relative overflow-hidden" dir="rtl">
      
      {/* تأثير ضوئي خلفي هادئ (Backlight) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* شعار بسيط بألوان التصميم السابق */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-black shadow-lg shadow-emerald-500/20 rotate-12">
            <Store size={24} />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
          أنشئ حساب مطعمك
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          ابدأ اليوم بإنشاء منيو إلكتروني احترافي
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px] relative z-10">
        {/* الكرت بتصميم الهيكل الجديد ولكن بألوان الـ Dark Modern */}
        <div className="bg-slate-900/50 px-8 py-10 shadow-2xl shadow-emerald-500/5 sm:rounded-3xl border border-white/5 backdrop-blur-xl">
          <form action={handleAction} className="space-y-6">
            
            {/* الحقول بتصميم Minimalist المظلم */}
            <div className="space-y-5">
              
              <InputGroup 
                label="اسم المطعم" 
                name="name" 
                type="text" 
                placeholder="مثلاً: شاورما السعادة" 
                icon={<Store size={18} />} 
              />

              <InputGroup 
                label="البريد الإلكتروني" 
                name="email" 
                type="email" 
                placeholder="name@restaurant.com" 
                icon={<Mail size={18} />} 
              />

              <InputGroup 
                label="رابط المنيو الخاص بك" 
                name="slug" 
                type="text" 
                placeholder="my-restaurant" 
                icon={<LinkIcon size={18} />}
                suffix=".menux.com" 
              />

              <InputGroup 
                label="رقم الواتساب" 
                name="whatsapp" 
                type="tel" 
                placeholder="9665xxxxxxxx" 
                icon={<Phone size={18} />} 
              />

              <InputGroup 
                label="كلمة المرور" 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                icon={<Lock size={18} />} 
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-500/10 text-lg font-black text-black bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all disabled:bg-slate-700 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin ml-2" size={20} />
                  جاري معالجة طلبك...
                </>
              ) : (
                "إنشاء الحساب الآن"
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <p className="text-sm text-slate-500">
              لديك حساب بالفعل؟{" "}
              <Link href="/login" className="font-bold text-white hover:text-emerald-400 transition-colors">
                سجل دخولك
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// مكون فرعي للحقول لضمان التناسق التام بألوان الـ Dark
function InputGroup({ label, name, type, placeholder, icon, suffix }: any) {
  return (
    <div className="space-y-1.5 text-right">
      <label className="block text-sm font-semibold text-slate-300 mr-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-500 transition-colors">
          {icon}
        </div>
        <input
          name={name}
          type={type}
          required
          placeholder={placeholder}
          className={`block w-full pr-11 pl-4 py-3 bg-slate-950/50 border border-white/5 text-white rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-600 text-sm`}
        />
        {suffix && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
}