import { QrCode } from 'lucide-react';
import Link from 'next/link';

export default function CTA() {
  return (
    
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
  );
}