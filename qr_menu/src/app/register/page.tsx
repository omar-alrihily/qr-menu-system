"use client";

import { registerRestaurant } from "../../lib/actions/auth";
import { useState } from "react";
import Link from "next/link";
import { Store, Mail, Link as LinkIcon, Phone, Lock, CheckCircle2, Loader2, ArrowRight, ChevronLeft, Globe } from "lucide-react";

// 1. تعريف المكون الفرعي خارج المكون الرئيسي أو داخله بشكل صحيح
const InputGroup = ({ label, name, type, placeholder, icon, suffix }: any) => (
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

// 2. التصدير الافتراضي للمكون الرئيسي
export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleAction(formData: FormData) {
    setLoading(true);
    try {
      const res = await registerRestaurant(formData);
      if (res?.success) {
        setSuccess(true);
      } else {
        alert("حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى");
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
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] max-w-md w-full animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 size={42} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">تم إنشاء الحساب!</h2>
          <p className="text-slate-500 mb-10 font-medium leading-relaxed">مطعمك الآن جاهز للتحول الرقمي. يمكنك البدء فوراً.</p>
          <Link href="/login" className="flex items-center justify-center gap-3 w-full py-4.5 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-slate-200 group">
            تسجيل الدخول
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-8 md:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" dir="rtl">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-emerald-100/40 blur-[120px] rounded-full -z-10 animate-pulse" />
      
      <div className="w-full max-w-3xl mx-auto relative z-10">
        <div className="flex justify-start mb-6 md:mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-all group text-sm font-bold bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm border border-slate-100">
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            العودة للرئيسية
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-emerald-500 rounded-[1.25rem] items-center justify-center text-white mb-6 shadow-xl shadow-emerald-200 rotate-12">
            <Store size={32} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">انضم إلى QR-Pro</h2>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">ابدأ رحلتك الرقمية الآن</p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl border border-white rounded-[2.5rem] p-6 md:p-12 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.06)]">
          <form action={handleAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <InputGroup label="اسم المنشأة" name="name" type="text" placeholder="مطعم السعادة" icon={<Store size={20} />} />
              <InputGroup label="البريد الإلكتروني" name="email" type="email" placeholder="admin@store.com" icon={<Mail size={20} />} />
              <InputGroup label="رابط المنيو" name="slug" type="text" placeholder="my-store" icon={<Globe size={20} />} suffix=".menux.com" />
              <InputGroup label="رقم الواتساب" name="whatsapp" type="tel" placeholder="9665xxxxxxxx" icon={<Phone size={20} />} />
              <div className="md:col-span-2">
                <InputGroup label="كلمة المرور" name="password" type="password" placeholder="••••••••" icon={<Lock size={20} />} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-3 py-4.5 rounded-[1.25rem] text-lg font-black text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] mt-4"
            >
              {loading ? <><Loader2 className="animate-spin" size={22} /> جاري المعالجة...</> : <>إنشاء الحساب <ChevronLeft size={22} /></>}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-slate-50">
            <p className="text-slate-500 font-medium text-sm">
              لديك حساب؟{" "}
              <Link href="/login" className="text-emerald-600 font-black hover:text-emerald-700 transition-colors underline underline-offset-8">
                سجل دخولك
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}