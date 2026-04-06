"use client";

import React from 'react';

// استبدل الروابط بشعارات الكافيهات والمطاعم الحقيقية
const logos = [
  { name: 'مطعم السعيد', url: 'https://hungerstation.com/_next/image?url=https%3A%2F%2Fimages.deliveryhero.io%2Fimage%2Fhungerstation%2Frestaurant%2Flogo_ar%2F1b6aa4a24a4cc1cce13dc9a1769c765e.png&w=384&q=75' },
  { name: 'كافيه قهوتك', url: 'https://hungerstation.com/_next/image?url=https%3A%2F%2Fimages.deliveryhero.io%2Fimage%2Fhungerstation%2Frestaurant%2Flogo_ar%2F383acb9c2514cc11c556284a961c4b37.jpg&w=384&q=75' },
  { name: 'بيتزا هت', url: 'https://hungerstation.com/_next/image?url=https%3A%2F%2Fimages.deliveryhero.io%2Fimage%2Fhungerstation%2Frestaurant%2Flogo_ar%2F7931385ba9ef1cc9c14152d1fcbbee6c.jpg&w=384&q=75' },
  { name: 'برجر كنج', url: 'https://hungerstation.com/_next/image?url=https%3A%2F%2Fimages.deliveryhero.io%2Fimage%2Fhungerstation%2Frestaurant%2Flogo_ar%2F64c4f2854700474916e1a1ede1fa4365.jpg&w=384&q=75' },
  { name: 'ستاربكس', url: 'https://hungerstation.com/_next/image?url=https%3A%2F%2Fimages.deliveryhero.io%2Fimage%2Fhungerstation%2Frestaurant%2Flogo_ar%2F6cfe589c7f5a5339eb629b6ce9725c7a.jpg&w=384&q=75' },
  { name: 'كنتاكي', url: 'https://hungerstation.com/_next/image?url=https%3A%2F%2Fimages.deliveryhero.io%2Fimage%2Fhungerstation%2Frestaurant%2Flogo_ar%2Fa46729dc1b57670ff4c2632a89cab31f.jfif&w=384&q=75' },
];

export default function Stats() {
  return (
    <section className="py-16 bg-white border-y border-slate-100 overflow-hidden">
      
      {/* حقن CSS الأنيميشن المُصلح: الحركة لـ -50% لضمان الانسيابية */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .scroll-container {
          display: flex;
          animation: scroll 35s linear infinite; /* جعلنا الحركة أبطأ قليلاً لأكثر احترافية */
          width: max-content; /* مهم جداً لكي يعمل التايل ويند بشكل صحيح */
        }
        .scroll-container:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h3 className="text-slate-500 text-xl md:text-xl font-bold uppercase tracking-[0.2em]">
            موثوق من قبل مئات الكوفيهات والمطاعم
          </h3>
        </div>

        <div className="relative">
          {/* تأثير التلاشي الجانبي (Gradients) */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

          {/* حاوية الحركة - يجب أن تكون LTR دائماً لتجنب مشاكل RTL */}
          <div className="overflow-hidden flex" dir="ltr">
            <div className="scroll-container flex items-center py-4">
              {/* نكرر المصفوفة مرتين فقط لكي يعمل الـ 50% بشكل صحيح */}
              {[...logos, ...logos].map((logo, i) => (
                <div 
                  key={i} 
                  className="flex-none px-10 md:px-14 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                >
                  <img
                    src={logo.url}
                    alt={logo.name}
                    className="h-10 md:h-12 w-auto object-contain block"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}