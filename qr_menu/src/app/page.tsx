"use client";
import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, QrCode, ShieldCheck, Zap, 
  ArrowLeft, MessageCircle, Star, Sparkles, 
  CheckCircle2, Rocket, Smartphone, Palette 
} from 'lucide-react';

export default function FlexMenuLandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-100 selection:text-emerald-900" dir="rtl">
      
      {/* 1. Header - Navigation */}
      <header className="fixed top-6 inset-x-0 z-50 flex justify-center px-4">
        <nav className="w-full max-w-7xl bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl px-6 py-3 flex items-center justify-between shadow-xl shadow-slate-200/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl rotate-3 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-200">
              FM
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Flex<span className='text-emerald-600'>Menu</span>
            </span>
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-bold text-slate-500">
            <a href="#features" className="hover:text-emerald-600 transition-colors relative group">
              المزايا الكاملة
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
            </a>
            <a href="#demo" className="hover:text-emerald-600 transition-colors relative group">
              تجربة حية
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
            </a>
            <a href="#steps" className="hover:text-emerald-600 transition-colors relative group">
              كيف يعمل؟
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
            </a>
            
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-slate-600 hover:text-emerald-600 text-sm font-bold transition-colors">
              تسجيل الدخول
            </Link>
            <Link 
              href="/register" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-emerald-200 active:scale-95"
            >
              ابدأ الآن مجاناً
            </Link>
          </div>
        </nav>
      </header>

      {/* 2. Hero Section - The Hook */}
      {/* 2. Hero Section - تصميم عصري ومنساب */}
      <section className="relative pt-48 pb-32 overflow-hidden bg-white">
        {/* عناصر ديكورية للخلفية لتعزيز المظهر البصري */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50/40 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-50/30 blur-[100px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          {/* Badge - متاح للجميع */}
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-5 py-2 rounded-2xl text-slate-800 text-sm font-bold mb-10 shadow-sm transition-transform hover:scale-105">
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
            <button className="w-full sm:w-auto px-14 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3">
              أنشئ قائمتك الآن
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button className="w-full sm:w-auto px-14 py-5 bg-slate-50 border border-slate-200 text-slate-700 rounded-[2rem] font-bold text-xl hover:bg-white hover:border-slate-300 transition-all flex items-center justify-center gap-2">
              <Zap size={20} className="text-amber-500 fill-amber-500" />
              تجربة حية
            </button>
          </div>

          {/* تلميح بصري أسفل الأزرار */}
          <p className="mt-8 text-sm font-bold text-slate-400 flex items-center justify-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            لا يتطلب بطاقة ائتمان • إعداد في أقل من دقيقتين
          </p>
        </div>
      </section>

      {/* 3. Social Proof & Quick Stats */}
      <section className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: 'شريك نجاح يثق بنا', val: '+1,500', icon: Star },
              { label: 'طلبات ناجحة يومياً', val: '+40k', icon: Rocket },
              { label: 'سرعة استجابة فائقة', val: '0.8s', icon: Zap },
              { label: 'رضا أصحاب المطاعم', val: '99%', icon: CheckCircle2 }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{stat.val}</div>
                <div className="text-slate-500 font-bold flex items-center gap-2">
                  <stat.icon size={16} className="text-emerald-500" />
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Features - The "Unlimited" Promise */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">قوة التحكم بين يديك</h2>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto">في فليكس منيو، نؤمن بأن نجاحك لا يجب أن يكون محدوداً. لذلك، نوفر لك كافة الأدوات الاحترافية منذ اللحظة الأولى.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <LayoutDashboard size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">لوحة تحكم ذكية وشاملة</h3>
              <p className="text-slate-500 leading-relaxed text-lg">أضف و عدل او غيّر الأسعار  بضغطة زر واحدة تحديثات فورية تظهر لعملائك في نفس اللحظة</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Palette size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">هوية بصرية مخصصة</h3>
              <p className="text-slate-500 leading-relaxed text-lg">المنيو الخاص بك يجب أن يشبه هويتك التجارية. اختر الألوان ارفع شعارك وخصص تصميم الـ QR ليتناسب مع فخامة علامتك التجارية</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-8 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Smartphone size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">تجربة مستخدم مثالية</h3>
              <p className="text-slate-500 leading-relaxed text-lg">مصمم ليعمل بسرعة فائقة على كافة الهواتف. صور الأطباق تظهر بجودة عالية تفتح شهية عملائك وتزيد من حجم الطلب.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Artistic Steps Section - مسار فني أفقي سطر واحد */}
      

      {/* 5. Demo Section - Interactive Visual */}
      <section id="demo" className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">اجعل التواصل مع عملائك <br /><span className="text-emerald-400">أسرع وأذكى</span></h2>
              
              <div className="space-y-6">
                {[
                  { title: "طلبات واتساب مباشرة", desc: "استقبل طلبات عملائك من المنيو إلى الواتساب الخاص بك فوراً بتنسيق احترافي.", icon: MessageCircle },
             { 
  title: "وصول بلمسة.. وتميز بـ QR فريد", 
  desc: "اجذب عملاءك بـ كود QR مخصص يحمل شعار مطعمك وألوانه، يفتح  فوراً بمسحة واحدة من كاميرا الهاتف، دون انتظار أو تطبيقات.", 
  icon: QrCode 
},
                  { title: "أمان واستقرار 100%", desc: "منيو مطعمك متاح دائماً على سيرفراتنا السحابية فائقة السرعة.", icon: ShieldCheck }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400 flex-shrink-0 border border-white/5">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
               {/* Phone Mockup Re-designed */}
               <div className="relative z-10 w-[300px] h-[600px] mx-auto bg-slate-800 rounded-[3.5rem] border-[8px] border-slate-700 shadow-2xl p-4">
                  <div className="w-24 h-6 bg-slate-700 rounded-b-2xl mx-auto mb-6"></div>
                  <div className="bg-white h-[510px] rounded-[2.5rem] overflow-hidden flex flex-col p-4">
                    <div className="w-full h-32 bg-slate-100 rounded-2xl mb-4 animate-pulse"></div>
                    <div className="space-y-4">
                      <div className="h-4 bg-slate-100 rounded-full w-2/3"></div>
                      <div className="h-20 bg-emerald-50 rounded-2xl flex items-center p-3 gap-3">
                        <div className="w-12 h-12 bg-emerald-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                           <div className="h-3 bg-emerald-100 rounded-full w-3/4"></div>
                           <div className="h-2 bg-emerald-100 rounded-full w-1/2"></div>
                        </div>
                      </div>
                      <div className="h-20 bg-slate-50 rounded-2xl flex items-center p-3 gap-3">
                        <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                           <div className="h-3 bg-slate-100 rounded-full w-3/4"></div>
                           <div className="h-2 bg-slate-100 rounded-full w-1/2"></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
                       إرسال الطلب عبر واتساب
                    </div>
                  </div>
               </div>
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      <section id="steps" className="py-24 bg-white relative overflow-hidden border-y border-slate-100">
        {/* توهج خلفي ناعم لتعزيز المظهر الفني */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-gradient-to-r from-emerald-50/20 via-white to-emerald-50/20 blur-3xl rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-950 mb-4 tracking-tight">انطلق <span className='text-emerald-600'>في دقائق</span></h2>
            <p className="text-lg text-slate-500 font-medium">خطوات بسيطة تفصلك عن امتلاك منيو ذكي واحترافي</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 relative">
            {/* خط الربط الفني - يظهر في الشاشات الكبيرة */}
            <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-emerald-100 via-emerald-400 to-emerald-100" />

            {/* الخطوة 1 */}
            <div className="flex-1 flex flex-col items-center group relative z-10 w-full md:w-auto">
              {/* الرقم والأيقونة مدمجان في تصميم واحد */}
              <div className="w-16 h-16 bg-white border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-600 mb-6 shadow-xl shadow-emerald-100 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                 <span className="text-2xl font-black">1</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-950 flex items-center gap-2 justify-center">
                   سجل حسابك <CheckCircle2 className='w-5 h-5 text-emerald-500' />
                </h3>
                <p className="text-slate-500 text-sm font-medium">ابدأ فوراً بكافة المزايا</p>
              </div>
            </div>

            {/* الخطوة 2 */}
            <div className="flex-1 flex flex-col items-center group relative z-10 w-full md:w-auto">
              <div className="w-16 h-16 bg-white border-2 border-slate-900 rounded-full flex items-center justify-center text-slate-900 mb-6 shadow-xl shadow-slate-100 group-hover:scale-110 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                 <span className="text-2xl font-black">2</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-950 flex items-center gap-2 justify-center">
                   املأ قائمتك <LayoutDashboard className='w-5 h-5 text-slate-600' />
                </h3>
                <p className="text-slate-500 text-sm font-medium">أضف منتجاتك وصورك بسهولة</p>
              </div>
            </div>

            {/* الخطوة 3 */}
            <div className="flex-1 flex flex-col items-center group relative z-10 w-full md:w-auto">
              <div className="w-16 h-16 bg-white border-2 border-emerald-400 rounded-full flex items-center justify-center text-emerald-500 mb-6 shadow-xl shadow-emerald-100 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                 <span className="text-2xl font-black">3</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-950 flex items-center gap-2 justify-center">
                   شارك الـ QR <QrCode className='w-5 h-5 text-emerald-400' />
                </h3>
                <p className="text-slate-500 text-sm font-medium">تميز ببراندك الخاص</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. CTA Section */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[3rem] p-12 md:p-20 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8">جاهز لنقل مطعمك للمستوى التالي؟</h2>
            <p className="text-xl text-emerald-50 mb-12 opacity-90">انضم إلى مئات المطاعم التي بدأت رحلة التحول الرقمي معنا. لا حاجة لبطاقة ائتمان، جميع المزايا متاحة من الآن!</p>
            <button className="bg-white text-emerald-700 px-12 py-5 rounded-2xl font-black text-2xl hover:bg-emerald-50 transition-all hover:scale-105 active:scale-95 shadow-xl">
              ابدأ الآن مجاناً 🚀
            </button>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <QrCode size={400} className="-translate-x-1/2 -translate-y-1/2 rotate-12" />
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="py-12 border-t border-slate-100 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">FM</div>
            <span className="font-black text-xl">FlexMenu</span>
          </div>
          <p className="text-slate-400 font-medium italic">صنع بشغف لخدمة المبدعين في عالم الضيافة © 2026</p>
          <div className="flex gap-6 text-slate-500 font-bold">
          </div>
        </div>
      </footer>
    </div>
  );
}