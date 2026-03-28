"use client";

import { useState } from "react";
import { forgotPassword } from "@/lib/actions/auth";
import Link from "next/link";
import { Mail, ArrowRight, AlertCircle, Loader2, CheckCircle2, ChevronLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setIsSubmitted(true);
        setMessage(result.message);
      } else {
        setError(result.message || "حدث خطأ ما، حاول لاحقاً");
      }
    } catch (err) {
      setError("فشل الاتصال بالسيرفر، تأكد من اتصالك");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-6 relative overflow-hidden" dir="rtl">
      
      {/* الخلفية الناعمة (نفس ستايل صفحة الدخول) */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-50/50 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-50/30 blur-[100px] rounded-full -z-10" />

      <div className="w-full max-w-[440px] relative z-10">
        
        {/* رابط العودة لصفحة الدخول */}
        <Link href="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-all mb-8 group text-sm font-bold bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          العودة لتسجيل الدخول
        </Link>

        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] text-center">
          
          {!isSubmitted ? (
            <>
              <div className="text-center mb-10">
                <div className="inline-flex w-14 h-14 bg-emerald-500 rounded-2xl rotate-12 items-center justify-center text-white mb-6 shadow-lg shadow-emerald-200">
                  <Mail size={28} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">استعادة الحساب</h2>
                <p className="text-slate-500 font-medium px-4">أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور</p>
              </div>

              {error && (
                <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2 text-right">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 text-right">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-black py-4.5 rounded-2xl text-lg shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      إرسال رابط الاستعادة
                      <ChevronLeft size={20} className="mr-1" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="py-6 animate-in zoom-in-95 duration-300">
              <div className="inline-flex w-20 h-20 bg-emerald-50 rounded-full items-center justify-center text-emerald-500 mb-6 border-4 border-white shadow-sm">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">تفقد بريدك الإلكتروني</h2>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                لقد أرسلنا رابطاً خاصاً إلى <br/>
                <span className="text-slate-900 font-bold">{email}</span>
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="text-emerald-600 font-black hover:text-emerald-700 transition-colors underline underline-offset-4 decoration-emerald-200"
              >
                لم يصلك الإيميل؟ حاول مجدداً
              </button>
            </div>
          )}
        </div>

        {/* تذييل بسيط */}
        <p className="mt-8 text-center text-slate-400 text-xs font-medium uppercase tracking-widest">
          أمانك هو أولويتنا القصوى
        </p>
      </div>
    </div>
  );
}