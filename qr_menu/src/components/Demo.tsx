import { QrCode, MessageCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Demo() {
  return (
    
      <section id="demo" className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">اجعل التواصل مع عملائك <br /><span className="text-emerald-400">أسرع وأذكى</span></h2>
              
              <div className="space-y-6">
                {[
                  { title: "طلبات واتساب مباشرة", desc: "استقبل طلبات عملائك من المنيو إلى الواتساب الخاص بك فوراً بتنسيق احترافي.", icon: MessageCircle },
             { 
  title: "وصول بلمسة.. وتميز بـ QR فريد", 
  desc: "اجذب عملاءك بـ كود QR مخصص يحمل شعار مطعمك وألوانه، يفتح  فوراً بمسحة واحدة من كاميرا الهاتف، دون انتظار أو تطبيقات.", 
  icon: QrCode 
},
                  { title: "أمان واستقرار 100%", desc: "منيو مطعمك متاح دائماً على سيرفراتنا السحابية فائقة السرعة.", icon: ShieldCheck }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400 flex-shrink-0 border border-white/5">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
               {/* Phone Mockup Re-designed */}
               <div className="relative z-10 w-[300px] h-[600px] mx-auto bg-slate-800 rounded-[3.5rem] border-[8px] border-slate-700 shadow-2xl p-4">
                  <div className="w-24 h-6 bg-slate-700 rounded-b-2xl mx-auto mb-6"></div>
                  <div className="bg-white h-[510px] rounded-[2.5rem] overflow-hidden flex flex-col p-4">
                    <div className="w-full h-32 bg-slate-100 rounded-2xl mb-4 animate-pulse"></div>
                    <div className="space-y-4">
                      <div className="h-4 bg-slate-100 rounded-full w-2/3"></div>
                      <div className="h-20 bg-emerald-50 rounded-2xl flex items-center p-3 gap-3">
                        <div className="w-12 h-12 bg-emerald-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                           <div className="h-3 bg-emerald-100 rounded-full w-3/4"></div>
                           <div className="h-2 bg-emerald-100 rounded-full w-1/2"></div>
                        </div>
                      </div>
                      <div className="h-20 bg-slate-50 rounded-2xl flex items-center p-3 gap-3">
                        <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                           <div className="h-3 bg-slate-100 rounded-full w-3/4"></div>
                           <div className="h-2 bg-slate-100 rounded-full w-1/2"></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
                       إرسال الطلب عبر واتساب
                    </div>
                  </div>
               </div>
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

  );
}