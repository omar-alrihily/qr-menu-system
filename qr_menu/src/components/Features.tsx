import { Star, Rocket, Zap, CheckCircle2, LayoutDashboard,Palette, Smartphone } from 'lucide-react';

const stats = [
  { label: 'شريك نجاح يثق بنا', val: '+1,500', icon: Star },
  { label: 'طلبات ناجحة يومياً', val: '+40k', icon: Rocket },
  { label: 'سرعة استجابة فائقة', val: '0.8s', icon: Zap },
  { label: 'رضا أصحاب المطاعم', val: '99%', icon: CheckCircle2 }
];

export default function Features() {
  return (
   <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">قوة التحكم بين يديك</h2>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto">في فليكس منيو، نؤمن بأن نجاحك لا يجب أن يكون محدوداً. لذلك، نوفر لك كافة الأدوات الاحترافية منذ اللحظة الأولى.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <LayoutDashboard size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">لوحة تحكم ذكية وشاملة</h3>
              <p className="text-slate-500 leading-relaxed text-lg">أضف و عدل او غيّر الأسعار  بضغطة زر واحدة تحديثات فورية تظهر لعملائك في نفس اللحظة</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Palette size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">هوية بصرية مخصصة</h3>
              <p className="text-slate-500 leading-relaxed text-lg">المنيو الخاص بك يجب أن يشبه هويتك التجارية. اختر الألوان ارفع شعارك وخصص تصميم الـ QR ليتناسب مع فخامة علامتك التجارية</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-8 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Smartphone size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">تجربة مستخدم مثالية</h3>
              <p className="text-slate-500 leading-relaxed text-lg">مصمم ليعمل بسرعة فائقة على كافة الهواتف. صور الأطباق تظهر بجودة عالية تفتح شهية عملائك وتزيد من حجم الطلب.</p>
            </div>
          </div>
        </div>
      </section>
  );
}