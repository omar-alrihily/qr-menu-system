"use client";

import { registerRestaurant } from "@/lib/actions/auth";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Store, Mail, Phone, Lock, CheckCircle2, Loader2, ArrowRight, ChevronLeft, Globe } from "lucide-react";

// 1. تحديث المكون الفرعي ليدعم التغيير في القيمة
const InputGroup = ({ label, name, type, placeholder, icon, suffix, value, onChange }: any) => (
  <div className="space-y-2.5">
    <label className="block text-sm font-bold text-slate-700 px-1 text-right">
      {label}
    </label>
    <div className="relative group" dir="rtl">
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-all duration-300">
        {icon}
      </div>
      <input
        name={name}
        type={type}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full pr-12 pl-4 py-4 bg-slate-50/50 border border-slate-100 text-slate-900 rounded-2xl outline-none focus:bg-white focus:border-emerald-500 focus:ring-[6px] focus:ring-emerald-500/5 transition-all placeholder:text-slate-400 font-medium text-sm md:text-base text-right"
      />
      {suffix && (
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <span className="text-[10px] font-black text-emerald-600/50 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100/50">
            {suffix}
          </span>
        </div>
      )}
    </div>
  </div>
);

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // حالة كلمة المرور والشروط
  const [password, setPassword] = useState("");
  const [validations, setValidations] = useState({
    minLength: false,
    hasUpper: false,
    hasNumber: false,
  });

  // تحديث الشروط عند كتابة كلمة المرور
  useEffect(() => {
    setValidations({
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    });
  }, [password]);

  const isPasswordValid = validations.minLength && validations.hasUpper && validations.hasNumber;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // منع التحديث الافتراضي للصفحة
    
    if (!isPasswordValid) return;

    setLoading(true);
    const formData = new FormData(event.currentTarget);
    
    try {
      const res = await registerRestaurant(formData);
      if (res?.success) {
        setSuccess(true);
      } else {
        alert(res?.error || "حدث خطأ أثناء التسجيل");
      }
    } catch (error) {
      alert("عذراً، حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 text-center " dir="rtl">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-xl max-w-md w-full">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={42} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">تم إنشاء الحساب!</h2>
          <Link href="/login" className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white font-black rounded-2xl">
            تسجيل الدخول
            <ChevronLeft size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-8 px-4 relative overflow-hidden" dir="rtl">
      <div className="w-full max-w-3xl mx-auto relative z-10">
         <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-all mb-8 group text-sm font-bold bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  العودة للرئيسية
                </Link>
        <div className="bg-white/90 backdrop-blur-xl border border-white rounded-[2.5rem] p-6 md:p-12 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="اسم المنشأة" name="name" type="text" placeholder="مطعم السعادة" icon={<Store size={20} />} />
              <InputGroup label="البريد الإلكتروني" name="email" type="email" placeholder="admin@store.com" icon={<Mail size={20} />} />
              <InputGroup label="رابط المنيو" name="slug" type="text" placeholder="my-store" icon={<Globe size={20} />} suffix=".menux.com" />
              <InputGroup label="رقم الواتساب" name="whatsapp" type="tel" placeholder="9665xxxxxxxx" icon={<Phone size={20} />} />
              
              <div className="md:col-span-2 space-y-3">
                <InputGroup 
                  label="كلمة المرور" 
                  name="password" 
                  type="password" 
                  placeholder="••••••••" 
                  icon={<Lock size={20} />}
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                />
                
                {/* عرض الشروط بشكل مبسط */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 px-2">
                  <Condition met={validations.minLength} text="8 أحرف" />
                  <Condition met={validations.hasUpper} text="حرف كبير" />
                  <Condition met={validations.hasNumber} text="رقم" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              className="w-full flex justify-center items-center gap-3 py-4.5 rounded-[1.25rem] text-lg font-black text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-all mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={22} /> : "إنشاء الحساب"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// مكون فرعي صغير للشروط
function Condition({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 text-xs font-bold transition-colors ${met ? "text-emerald-600" : "text-slate-400"}`}>
      <div className={`w-2 h-2 rounded-full ${met ? "bg-emerald-500" : "bg-slate-200"}`} />
      {text}
    </div>
  );
}