import { PhoneCall, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white py-10 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* تصميم اللوقو القديم المطور */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
              FM
            </div>
            <span className="font-black text-xl tracking-tight text-slate-900">FlexMenu</span>
          </div>

          {/* خانة الدعم الفني */}
          <a 
            href="https://wa.me/966549262671" 
            className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-5 py-2.5 rounded-xl transition-all"
          >
            <div className="text-green-600">
              <PhoneCall size={18} />
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold leading-none mb-1">تواصل معنا</p>
              <p className="text-sm font-black text-slate-700">الدعم الفني</p>
            </div>
          </a>

          {/* نص الحقوق فقط */}
          <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
            <span>صنع بشغف</span>
            <Heart size={14} className="text-red-400 fill-red-400" />
            <span>لعالم الضيافة © 2026</span>
          </div>

        </div>
      </div>
    </footer>
  );
}