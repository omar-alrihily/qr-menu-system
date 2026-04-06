import { QrCode } from 'lucide-react';
import Link from 'next/link';

export default function CTA() {
  return (
    
    <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[3rem] p-12 md:p-20 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8">جاهز لنقل مطعمك للمستوى التالي؟</h2>
            <p className="text-xl text-emerald-50 mb-12 opacity-90">انضم إلى مئات المطاعم التي بدأت رحلة التحول الرقمي معنا. لا حاجة لبطاقة ائتمان، جميع المزايا متاحة من الآن!</p>
            <Link href="/register">
  <button className="bg-white text-emerald-700 px-12 py-5 rounded-2xl font-black text-2xl hover:bg-emerald-50 transition-all hover:scale-105 active:scale-95 shadow-xl">
    ابدأ الآن مجاناً 🚀
  </button>
</Link>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <QrCode size={400} className="-translate-x-1/2 -translate-y-1/2 rotate-12" />
          </div>
        </div>
      </section>
  );
}