import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Features from '@/components/Features';
import Demo from '@/components/Demo';
import Steps from '@/components/Steps';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

// تحسين SEO الصفحة - Metadata ثابتة
export const metadata: Metadata = {
  title: 'فليكس منيو | أنشئ منيو إلكتروني QR احترافي لمطعمك',
  description: 'نظام فليكس منيو يساعدك على تحويل قائمة طعامك إلى منيو إلكتروني ذكي يدعم طلبات الواتساب وتخصيص الهوية البصرية بالكامل.',
  keywords: ['منيو الكتروني', 'QR Menu', 'السعودية', 'منيو مطاعم', 'طلبات واتساب', 'أتمتة المطاعم'],
  alternates: {
    canonical: 'https://flexm.pro',
  },
  openGraph: {
    title: 'فليكس منيو | نظام المنيو الذكي',
    description: 'حول منيو مطعمك الورقي إلى تجربة رقمية تفاعلية.',
    url: 'https://flexm.pro',
    siteName: 'FlexMenu',
    locale: 'ar_SA',
    type: 'website',
    images: [
      {
        url: 'https://flexm.pro/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'واجهة نظام فليكس منيو',
      },
    ],
  },
};

export default function Page() {
  // بيانات الـ Schema لإخبار جوجل بنوع الخدمة ومميزاتها
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "فليكس منيو - FlexMenu",
    "url": "https://flexm.pro",
    "operatingSystem": "WEB",
    "applicationCategory": "BusinessApplication",
    "description": "نظام لإنشاء وإدارة المنيو الرقمي QR للمطاعم والكافيهات مع ميزة طلبات الواتساب وتخصيص كامل للهوية البصرية.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "150"
    },
    "offers": {
      "@type": "Offer",
      "price": "0.00", // يظهر كخدمة تبدأ مجاناً
      "priceCurrency": "SAR"
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-100 selection:text-emerald-900" dir="rtl">
      
      {/* حقن بيانات الـ Schema في الـ Head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Header */}
      <header className="fixed top-6 inset-x-0 z-50 flex justify-center px-4">
        <Navbar />
      </header>

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Social Proof */}
      <Stats />

      {/* 4. Features */}
      <Features />

      {/* 5. Demo Section */}
      <Demo />

      {/* 6. Steps Section */}
      <Steps />

      {/* 7. CTA Section */}
      <CTA />

      {/* 8. Footer */}
      <Footer />

    </div>
  );
}