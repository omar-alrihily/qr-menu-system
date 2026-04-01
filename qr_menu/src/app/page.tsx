import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import { 
  LayoutDashboard, QrCode, ShieldCheck, Zap, 
  ArrowLeft, MessageCircle, Star, Sparkles, 
  CheckCircle2, Rocket, Smartphone, Palette 
} from 'lucide-react';

// تحسين SEO الصفحة
export const metadata: Metadata = {
  title: 'فليكس منيو | أنشئ منيو إلكتروني QR احترافي لمطعمك',
  description: 'نظام فليكس منيو يساعدك على تحويل قائمة طعامك إلى منيو إلكتروني ذكي يدعم طلبات الواتساب وتخصيص الهوية البصرية بالكامل.',
  keywords: ['منيو الكتروني', 'QR Menu', 'السعودية', 'منيو مطاعم', 'طلبات واتساب'],
};

export default function Page() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-100 selection:text-emerald-900" dir="rtl">
      
      {/* 1. Header */}
      <header className="fixed top-6 inset-x-0 z-50 flex justify-center px-4">
        <Navbar />
      </header>

      {/* 2. Hero Section */}
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
            <button className="w-full sm:w-auto px-14 py-5 bg-slate-50 border border-slate-200 text-slate-700 rounded-[2rem] font-bold text-xl hover:bg-white transition-all flex items-center justify-center gap-2">
              <Zap size={20} className="text-amber-500 fill-amber-500" />
              تجربة حية
            </button>
          </div>
        </div>
      </section>

      {/* 3. Social Proof */}
      <section className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: 'شريك نجاح يثق بنا', val: '+1,500', icon: Star },
              { label: 'طلبات ناجحة يومياً', val: '+40k', icon: Rocket },
              { label: 'سرعة استجابة فائقة', val: '0.8s', icon: Zap },
              { label: 'رضا أصحاب المطاعم', val: '99%', icon: CheckCircle2 }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2">{stat.val}</div>
                <div className="text-slate-500 font-bold flex items-center gap-2">
                  <stat.icon size={16} className="text-emerald-500" />
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* باقي الأقسام تتبع نفس النمط... */}
      {/* 4. Features, 5. Demo, 6. Steps, 7. CTA, 8. Footer */}
      
      {/* مثال على قسم الـ Features لضمان الأداء */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
           <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">قوة التحكم بين يديك</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {/* Feature 1 */}
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 mx-auto">
                  <LayoutDashboard size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">لوحة تحكم ذكية</h3>
                <p className="text-slate-500 leading-relaxed">أضف وعدل الأسعار بضغطة زر واحدة مع تحديثات فورية تظهر لعملائك.</p>
              </div>
              {/* ... تكرار لبقية المزايا ... */}
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">FM</div>
            <span className="font-black text-xl">FlexMenu</span>
          </div>
          <p className="text-slate-400 font-medium italic">صنع بشغف لخدمة المبدعين في عالم الضيافة © 2026</p>
        </div>
      </footer>

    </div>
  );
}