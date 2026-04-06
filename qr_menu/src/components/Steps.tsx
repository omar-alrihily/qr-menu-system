import { QrCode, LayoutDashboard, Zap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function Steps() {
  return (
    
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
  );
}