import { Sparkles, ArrowLeft, Zap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    
      <section className="relative pt-48 pb-32 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50/40 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-50/30 blur-[100px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-5 py-2 rounded-2xl text-slate-800 text-sm font-bold mb-10 shadow-sm">
            <Sparkles size={16} className="text-emerald-500" />
            <span>كافة المميزات الاحترافية <span className="text-emerald-600">متاحة لك فوراً</span></span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight text-slate-950">
            منيو إلكتروني<br />
            <span className="relative">
              <span className="relative z-10 text-emerald-600">مميز لكل مطعم</span>
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-emerald-100 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
              </svg>
            </span>
          </h1>
          
          <p className="max-w-4xl mx-auto text-xl md:text-2xl text-slate-500 mb-14 leading-relaxed font-medium">
            امنح عملائك تجربة تصفح تفاعلية تتجاوز توقعاتهم. سرعة فائقة، نظام طلب ذكي، وتصميم يعكس تفرد علامتك التجارية.. 
            <span className="block mt-4 text-slate-900 font-bold">بحرية كاملة، وبدون أي حدود لاستخدامك.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link href="/register" className="w-full sm:w-auto px-14 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3">
              أنشئ قائمتك الآن
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <Link 
  href="https://www.flexm.pro/r/bu1" 
  target="_blank" 
  className="w-full sm:w-auto px-14 py-5 bg-slate-50 border border-slate-200 text-slate-700 rounded-[2rem] font-bold text-xl hover:bg-white transition-all flex items-center justify-center gap-2"
>
  <Zap size={20} className="text-amber-500 fill-amber-500" />
  تجربة حية
</Link>
          </div>
        </div>
      </section>
  );
}