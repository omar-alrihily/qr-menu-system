"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 px-4 py-4 ${scrolled ? 'md:top-2' : 'md:top-4'}`}>
      <div className="max-w-7xl mx-auto">
        <div className={`
          relative flex items-center justify-between px-4 py-2 md:py-3 transition-all duration-500
          ${scrolled 
            ? 'bg-white shadow-xl shadow-slate-200/50 border-slate-200' 
            : 'bg-white/80 backdrop-blur-lg border-white/40'}
          border rounded-2xl md:rounded-full
        `}>
          
          {/* 1. قسم الأزرار (يسار) */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 md:flex-initial">
            <Link 
              href="/register" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-xl md:rounded-full font-bold text-xs md:text-sm transition-all active:scale-95 whitespace-nowrap"
            >
              ابدأ الآن
            </Link>
            
            <Link href="/login" className="hidden sm:block text-xs md:text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
              تسجيل الدخول
            </Link>

            {/* زر الموبايل */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6H13M4 12H18M4 18H11" />
                )}
              </svg>
            </button>
          </div>

          {/* 2. الروابط (وسط) - تظهر في الشاشات الكبيرة فقط */}
          <div className="hidden md:flex items-center gap-1 bg-slate-50 p-1 rounded-full border border-slate-100">
            {[
              ['المزايا الكاملة', '#features'],
              ['تجربة حية', '#demo'],
              ['كيف يعمل؟', '#steps'],
            ].map(([title, url]) => (
              <a 
                key={url} 
                href={url} 
                className="px-4 py-1.5 text-sm font-bold text-slate-500 hover:text-emerald-600 hover:bg-white rounded-full transition-all"
              >
                {title}
              </a>
            ))}
          </div>

          {/* 3. اللوجو (يمين) */}
          <div className="flex items-center gap-2 md:gap-3 flex-1 md:flex-initial justify-end">
            <span className="text-lg md:text-2xl font-black tracking-tight text-slate-900 hidden xs:block">
              Flex<span className='text-emerald-600'>Menu</span>
            </span>
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl rotate-3 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-200 shrink-0">
              FM
            </div>
          </div>
        </div>

        {/* قائمة الموبايل المنسدلة */}
        <div className={`
          absolute top-full left-4 right-4 mt-2 overflow-hidden transition-all duration-300 ease-in-out md:hidden
          ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
        `}>
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 space-y-2">
            <a href="#features" onClick={() => setIsOpen(false)} className="block p-3 font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors text-right">المزايا الكاملة</a>
            <a href="#demo" onClick={() => setIsOpen(false)} className="block p-3 font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors text-right">تجربة حية</a>
            <a href="#steps" onClick={() => setIsOpen(false)} className="block p-3 font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors text-right">كيف يعمل؟</a>
            <div className="h-px bg-slate-100 my-2" />
            <Link href="/login" onClick={() => setIsOpen(false)} className="block p-3 font-bold text-slate-600 sm:hidden text-right">تسجيل الدخول</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}