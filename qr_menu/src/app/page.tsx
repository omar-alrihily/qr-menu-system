import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Features from '@/components/Features';
import Demo from '@/components/Demo';
import Steps from '@/components/Steps';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
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
     <Hero />
      {/* 3. Social Proof */}
        <Stats />

    
      
      {/* مثال على قسم الـ Features لضمان الأداء */}
   <Features />

      {/* 3. Social Proof & Quick Stats */}
      

      {/* 4. Features - The "Unlimited" Promise */}
     
      {/* 4. Artistic Steps Section - مسار فني أفقي سطر واحد */}
      

      {/* 5. Demo Section - Interactive Visual */}
     <Demo />

    <Steps />

      {/* 6. CTA Section */}
     <CTA />

      {/* 7. Footer */}
     <Footer />

    </div>
  );
}