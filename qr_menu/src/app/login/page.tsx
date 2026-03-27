"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, ChevronLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("حدث خطأ غير متوقع، يرجى المحاولة لاحقاً");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-6 relative overflow-hidden " dir="rtl">
      
      {/* خلفية ناعمة (Soft Decorative Elements) */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-50/50 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-50/30 blur-[100px] rounded-full -z-10" />

      <div className="w-full max-w-[440px] relative z-10">
        
        {/* رابط العودة - تصميم أنيق */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-all mb-8 group text-sm font-bold bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          العودة للرئيسية
        </Link>

        {/* الكرت الرئيسي - أبيض نقي بظلال احترافية */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
          <div className="text-center mb-10">
            {/* الشعار المعتمد في الـ Header */}
            <div className="inline-flex w-14 h-14 bg-emerald-500 rounded-2xl rotate-12 items-center justify-center text-white mb-6 shadow-lg shadow-emerald-200">
              <Lock size={28} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">مرحباً بك مجدداً</h2>
            <p className="text-slate-500 font-medium">أدخل بياناتك للوصول إلى لوحة التحكم</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* حقل البريد الإلكتروني */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 mr-1">البريد الإلكتروني</label>
              <div className="relative group">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="name@store.com"
                  className="w-full bg-gray-50 border border-slate-100 rounded-2xl py-4 pr-12 pl-4 text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all placeholder:text-slate-400 font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* حقل كلمة المرور */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-slate-700">كلمة المرور</label>
                <Link href="#" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">نسيت كلمة المرور؟</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-slate-100 rounded-2xl py-4 pr-12 pl-4 text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all placeholder:text-slate-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* زر الدخول - مطابق لزر الـ Hero */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-black py-4.5 rounded-2xl text-lg shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  جاري التحقق...
                </>
              ) : (
                <>
                  تسجيل الدخول
                  <ChevronLeft size={20} className="mr-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center pt-8 border-t border-slate-50">
            <p className="text-slate-500 font-medium">
              ليس لديك حساب؟{" "}
              <Link href="/register" className="text-emerald-600 font-black hover:text-emerald-700 transition-colors underline underline-offset-4 decoration-emerald-200">
                ابدأ مجاناً الآن
              </Link>
            </p>
          </div>
        </div>

        {/* تذييل بسيط */}
        <p className="mt-8 text-center text-slate-400 text-xs font-medium">
          جميع الحقوق محفوظة © 2026 QR-Pro
        </p>
      </div>
    </div>
  );
}