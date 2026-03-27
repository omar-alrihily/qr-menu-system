"use client";
import React from 'react';
import Link from 'next/link';
// استيراد الأيقونات الإضافية لزوم التصميم الجديد
import { LayoutDashboard, QrCode, ShieldCheck, Zap, ArrowLeft, MessageCircle, Star } from 'lucide-react';

export default function LightLandingPage() {
  return (
    // الخلفية الأساسية بيضاء تماماً مع نص داكن، وتحديد اتجاه النص RTL
    <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-100" dir="rtl">
      
      {/* 1. Header - تصميم عائم شفاف ولكن فاتح */}
      <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
        <nav className="w-full max-w-7xl bg-white/70 backdrop-blur-lg border border-slate-100 rounded-full px-5 py-2.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            {/* الشعار احتفظنا به أخضر ولكنه أفتح قليلاً ليتناسب مع البياض */}
            <div className="w-8 h-8 bg-emerald-500 rounded-xl rotate-12 flex items-center justify-center text-white font-black font-sans shadow-inner">Q</div>
            <span className="text-xl font-bold tracking-tight text-slate-950">QR-<span className='text-emerald-600'>Pro</span></span>
          </div>
          
          <div className="hidden md:flex gap-7 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-emerald-600 transition-colors">المزايا</a>
            <a href="#demo" className="hover:text-emerald-600 transition-colors">جرب المنيو</a>
            <a href="#pricing" className="hover:text-emerald-600 transition-colors">الأسعار</a>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/login" className="hidden sm:block text-slate-700 hover:text-emerald-700 text-sm font-semibold px-4 transition-colors">
              تسجيل الدخول
            </Link>
            
            <Link 
              href="/register" 
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105 shadow-md"
            >
              ابدأ مجاناً
            </Link>
          </div>
        </nav>
      </header>

      {/* 2. Hero Section - تأثير قوى ولكن بألوان فاتحة وناعمة */}
      <section className="relative pt-36 pb-20 overflow-hidden bg-gray-50/50">
        {/* تدرجات لونيّة ناعمة جداً في الخلفية بدلاً من البقع المضيئة الداكنة */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-50/50 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-[1.15] tracking-tighter text-slate-950">
            مستقبل المطاعم <br />
            {/* تدرج لوني فاتح وأنيق */}
            <span className="bg-gradient-to-l from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              رقمي بامتياز
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 mb-12 leading-relaxed font-medium">
            وداعاً للمنيو الورقي التقليدي. امنح عملاءك تجربة تصفح تفاعلية، سريعة، وأنيقة مباشرة من هواتفهم عبر رمز QR مخصص لعلامتك التجارية.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <button className="px-10 py-4.5 bg-emerald-500 text-white rounded-full font-extrabold text-lg shadow-emerald-200 shadow-lg hover:bg-emerald-600 transition-all group flex items-center justify-center gap-2">
              إنشاء حسابي الآن 
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform" />
            </button>
            <button className="px-10 py-4.5 bg-white border border-slate-200 text-slate-800 rounded-full font-bold text-lg hover:bg-slate-50 transition-colors shadow-sm">
              جرب المنيو التجريبي
            </button>
          </div>
        </div>
      </section>

      {/* 3. Metrics Section - مظهر "مسطح" وأنيق */}
      <section className="py-14 border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'متجر مشترك', val: '+2,500' },
            { label: 'طلب يومي', val: '+50k' },
            { label: 'سرعة التحميل', val: '0.8s' },
            { label: 'تقييم الخدمة', val: '4.9/5' }
          ].map((stat, i) => (
            <div key={i} className="text-center p-5 bg-gray-50 rounded-2xl border border-slate-100">
              <div className="text-4xl font-black text-emerald-600 mb-1.5">{stat.val}</div>
              <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Features Section - إعادة تصميم كامل بنمط Bento Grid الفاتح */}
      <section id="features" className="py-28 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            {/* إزالة التسطير والمظهر القديم واستبداله بتصميم تايبوجرافي عصري */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-950 mb-4 tracking-tight">لماذا تختار <span className='text-emerald-600'>QR-Pro</span>؟</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">نحن لا نقدم مجرد كود، نحن نقدم أداة ذكية ومتكاملة لزيادة أرباح مطعمك.</p>
          </div>
          
          {/* شبكة بينتو (Bento Grid) - توزيع غير متساوي للمظاهر العصرية */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* ميزة 1 - كبيرة (طولية) */}
            <div className="md:row-span-2 group p-9 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="mb-8 bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform">
                  <LayoutDashboard className="text-emerald-600" size={32} />
                </div>
                <h4 className="text-2xl font-bold mb-4 text-slate-950">لوحة تحكم ذكية</h4>
                <p className="text-slate-600 leading-relaxed font-medium">إدارة كاملة للأصناف، الأسعار، والإضافات بمرونة تامة ومن أي مكان، مع إحصائيات دقيقة لمبيعاتك.</p>
              </div>
              <div className="mt-10 pt-6 border-t border-slate-100 text-sm text-emerald-700 font-bold">سهولة تحكم مطلقة ✓</div>
            </div>

            {/* ميزة 2 - عريضة */}
            <div className="md:col-span-2 group p-9 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex items-center gap-8">
              <div className="mb-6 bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center border border-blue-100 flex-shrink-0">
                <QrCode className="text-blue-600" size={32} />
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-3 text-slate-950">QR مخصص لهويتك</h4>
                <p className="text-slate-600 leading-relaxed font-medium">صمم الكود الخاص بك بألوان متجرك وشعارك لتعزيز الهوية البصرية، واجعله قابلاً للمسح بسهولة.</p>
              </div>
            </div>

            {/* ميزة 3 - عريضة */}
            <div className="md:col-span-2 group p-9 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-purple-100 transition-all duration-300 flex items-center gap-8">
              <div className="mb-6 bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center border border-purple-100 flex-shrink-0">
                <ShieldCheck className="text-purple-600" size={32} />
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-3 text-slate-950">أمان واستقرار سحابي</h4>
                <p className="text-slate-600 leading-relaxed font-medium">خدمة سحابية موثوقة تضمن عمل المنيو الخاص بك على مدار الساعة دون توقف، مع حماية كاملة لبياناتك.</p>
              </div>
            </div>
             
          </div>
        </div>
      </section>

      {/* 5. Demo Section - تصميم أنيق "Soft" مع هاتف وهمي فاتح */}
      <section id="demo" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-emerald-50 rounded-[3rem] p-10 md:p-16 overflow-hidden relative border border-emerald-100 shadow-inner">
            <div className="grid lg:grid-cols-5 gap-12 items-center relative z-10">
              
              <div className="lg:col-span-3">
                <div className="flex items-center gap-2 mb-6">
                    <Zap className="text-emerald-500 w-6 h-6"/>
                    <span className="text-emerald-800 font-bold text-sm bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">السرعة والبساطة</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-black mb-8 text-slate-950 leading-tight">سهولة الاستخدام هي أولويتنا</h3>
                <ul className="space-y-6">
                  {[
                    "تحديثات فورية للأصناف دون الحاجة لإعادة طباعة الكود.",
                    "دعم كامل لجميع أنواع الموبايلات والمتصفحات الحديثة.",
                    "نظام طلبات واتساب متطور ومؤتمت بالكامل لراحة بالك."
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-4 text-lg text-slate-700 font-medium">
                        <div className="w-7 h-7 rounded-full bg-white text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow border border-emerald-100">✓</div>
                        <span>{text}</span>
                    </li>
                  ))}
                </ul>
                
                <div className='flex gap-4 mt-12'>
                   <div className='flex items-center gap-1.5 bg-white p-3 rounded-2xl border border-emerald-100 shadow-sm'>
                       <MessageCircle className='w-10 h-10 text-emerald-500 bg-emerald-50 p-2 rounded-xl' />
                       <div className='text-sm'>
                           <div className='font-bold text-slate-900'>مدمج مع واتساب</div>
                           <div className='text-slate-500'>استقبل طلباتك فوراً</div>
                       </div>
                   </div>
                   <div className='flex items-center gap-1.5 bg-white p-3 rounded-2xl border border-emerald-100 shadow-sm'>
                       <Star className='w-10 h-10 text-amber-500 bg-amber-50 p-2 rounded-xl fill-amber-400' />
                       <div className='text-sm'>
                           <div className='font-bold text-slate-900'>نظام تقييم</div>
                           <div className='text-slate-500'>اعرف آراء عملائك</div>
                       </div>
                   </div>
                </div>

              </div>
              
              {/* قسم الهاتف - تم تحويله ليصبح فاتحاً وأنيقاً */}
              <div className="lg:col-span-2 relative">
                {/* تأثير خلفية توهج ناعم وأخضر */}
                <div className="absolute inset-0 bg-emerald-200/50 blur-[80px] rounded-full" />
                
                {/* مجسم الهاتف - لون فاتح */}
                <div className="relative bg-white rounded-[2.5rem] border-[10px] border-slate-900/5 p-3 shadow-2xl rotate-3 h-[500px] w-[260px] mx-auto flex flex-col">
                    {/* الكاميرا العلويّة (Notch) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-900/5 rounded-b-xl z-20"></div>
                    
                    {/* شاشة الهاتف */}
                    <div className="bg-slate-50 h-full rounded-[1.8rem] flex flex-col items-center justify-center text-slate-400 p-4 border border-slate-100 overflow-hidden relative">
                       {/* محاكاة واجهة منيو فاتحة */}
                       <div className='absolute top-6 left-4 right-4 h-6 bg-slate-100 rounded-full'></div>
                       <div className='absolute top-16 left-4 w-16 h-16 bg-slate-100 rounded-2xl'></div>
                       <div className='absolute top-16 left-24 right-4 h-5 bg-slate-100 rounded-full'></div>
                       <div className='absolute top-24 left-24 right-12 h-4 bg-slate-100 rounded-full'></div>
                       
                       <div className='w-full space-y-3 mt-20'>
                           <div className='h-24 bg-white rounded-2xl border border-slate-100 p-3 flex gap-3'>
                               <div className='w-16 h-16 bg-emerald-50 rounded-xl border border-emerald-100'></div>
                               <div className='flex-1 space-y-2'>
                                   <div className='h-4 bg-slate-100 rounded-full w-3/4'></div>
                                   <div className='h-3 bg-slate-100 rounded-full w-1/2'></div>
                                   <div className='h-4 bg-emerald-100 rounded-full w-1/4 mt-2'></div>
                               </div>
                           </div>
                           <div className='h-24 bg-white rounded-2xl border border-slate-100 p-3 flex gap-3'>
                               <div className='w-16 h-16 bg-emerald-50 rounded-xl border border-emerald-100'></div>
                               <div className='flex-1 space-y-2'>
                                   <div className='h-4 bg-slate-100 rounded-full w-3/4'></div>
                                   <div className='h-3 bg-slate-100 rounded-full w-1/2'></div>
                                   <div className='h-4 bg-emerald-100 rounded-full w-1/4 mt-2'></div>
                               </div>
                           </div>
                       </div>

                       <div className='absolute bottom-4 left-4 right-4 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md'>
                           عرض السلة (٢)
                       </div>
                    </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer - بسيط وواضح بخلفية رمادية فاتحة */}
      <footer className="py-14 px-6 bg-gray-50 border-t border-slate-100 text-center">
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-7 h-7 bg-emerald-500 rounded-lg rotate-12 flex items-center justify-center text-white font-black font-sans text-xs">Q</div>
                <span className="text-lg font-bold tracking-tight text-slate-950">QR-Pro</span>
            </div>
            <p className="text-slate-500 font-medium">جميع الحقوق محفوظة © 2026 QR-Pro. صنع بحب لخدمة قطاع الضيافة.</p>
        </div>
      </footer>

    </div>
  );
}