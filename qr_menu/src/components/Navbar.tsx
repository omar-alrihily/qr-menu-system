"use client"; // التفاعل محصور هنا فقط
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative w-full max-w-7xl mx-auto">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl px-6 py-3 flex items-center justify-between shadow-xl shadow-slate-200/20">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl rotate-3 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-200">
            FM
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Flex<span className='text-emerald-600'>Menu</span>
          </span>
        </div>

        {/* Desktop Links */}
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

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block text-slate-600 hover:text-emerald-600 text-sm font-bold transition-colors">
            تسجيل الدخول
          </Link>
          <Link 
            href="/register" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-emerald-200 active:scale-95"
          >
            ابدأ الآن
          </Link>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`
        absolute top-full left-0 right-0 mt-2 p-4 bg-white border border-slate-200 shadow-2xl rounded-2xl md:hidden transition-all duration-300 origin-top
        ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
      `}>
        <div className="flex flex-col gap-4 text-right">
          <a href="#features" onClick={() => setIsOpen(false)} className="p-2 font-bold text-slate-600 hover:text-emerald-600">المزايا الكاملة</a>
          <a href="#demo" onClick={() => setIsOpen(false)} className="p-2 font-bold text-slate-600 hover:text-emerald-600">تجربة حية</a>
          <a href="#steps" onClick={() => setIsOpen(false)} className="p-2 font-bold text-slate-600 hover:text-emerald-600">كيف يعمل؟</a>
          <hr className="border-slate-100" />
          <Link href="/login" onClick={() => setIsOpen(false)} className="p-2 font-bold text-slate-600 sm:hidden">تسجيل الدخول</Link>
        </div>
      </div>
    </nav>
  );
}