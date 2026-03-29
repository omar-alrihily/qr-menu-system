import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { Restaurant } from "@/models/Restaurant";
import Link from "next/link";
import { PlusCircle, Utensils, List, ArrowLeft, QrCode, Download, ExternalLink, Activity, ChevronLeft } from "lucide-react";
import QRCode from "qrcode";
import CopyButton from "@/app/dashboard/CopyButton";

export default async function DashboardPage() {
  const session = await auth();
  await dbConnect();

  const restaurant = await Restaurant.findOne({ email: session?.user?.email });

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center font-[tajawal] min-h-screen bg-gray-50  p-6 text-center" dir="rtl">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-red-50 max-w-md">
           <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">⚠️</div>
           <h2 className="text-2xl font-black text-slate-900 mb-2">بيانات مفقودة</h2>
           <p className="text-slate-500">لم يتم العثور على بيانات المطعم المرتبطة بهذا الحساب.</p>
        </div>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const menuUrl = `${baseUrl}/r/${restaurant.slug}`;

  if (!restaurant.qr_code) {
    try {
      const generatedQr = await QRCode.toDataURL(menuUrl, {
        width: 600,
        margin: 2,
         color: {
  dark: "#000000", 
  light: "#ffffff",
        },
      });
      await Restaurant.findByIdAndUpdate(restaurant._id, { qr_code: generatedQr });
      restaurant.qr_code = generatedQr;
    } catch (err) {
      console.error("QR Generation Error:", err);
    }
  }

  const productsCount = await Product.countDocuments({ restaurant_id: restaurant._id });
  const categoriesCount = await Category.countDocuments({ restaurant_id: restaurant._id });

  return (
    <div className="min-h-screen bg-[#FDFDFD]  text-slate-900 p-4 md:p-10 space-y-10" dir="rtl">
      
      {/* الترويسة - ترحيب راقي */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-950 tracking-tight">لوحة التحكم</h1>
          <p className="text-slate-500 mt-2 font-medium">
            مرحباً بك مجدداً في <span className="text-emerald-600 font-bold underline underline-offset-4 decoration-emerald-100">{restaurant.name}</span>
          </p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-full border border-emerald-100 flex items-center gap-2 text-sm font-bold shadow-sm">
           <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
           المتجر متصل ونشط
        </div>
      </div>
      
      {/* بطاقات الإحصائيات - نمط نظيف وواضح */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="الأقسام" 
          value={categoriesCount.toString()} 
          icon={<List size={24} />}
          color="bg-emerald-50 text-emerald-600 border-emerald-100" 
        />
        <StatCard 
          title="المنتجات" 
          value={productsCount.toString()} 
          icon={<Utensils size={24} />}
          color="bg-blue-50 text-blue-600 border-blue-100" 
        />
        <StatCard 
          title="حالة الرابط" 
          value="نشط" 
          icon={<Activity size={24} />}
          color="bg-orange-50 text-orange-600 border-orange-100" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* إجراءات سريعة - كروت عصرية */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/40">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-slate-900">
              <PlusCircle size={22} className="text-emerald-500" /> إجراءات سريعة
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/dashboard/products" className="flex items-center justify-between p-6 bg-gray-50 border border-transparent hover:border-emerald-100 hover:bg-white hover:shadow-xl hover:shadow-emerald-500/5 rounded-[1.8rem] transition-all group">
                <div className="flex flex-col items-start">
                  <span className="font-black text-slate-900 mb-0.5 text-lg">إضافة منتج</span>
                  <span className="text-xs text-slate-500 font-medium">أضف أطباقك وصورك وأسعارك</span>
                </div>
                <ChevronLeft size={20} className="group-hover:-translate-x-1 text-emerald-500 transition-transform" />
              </Link>
              <Link href="/dashboard/categories" className="flex items-center justify-between p-6 bg-gray-50 border border-transparent hover:border-emerald-100 hover:bg-white hover:shadow-xl hover:shadow-emerald-500/5 rounded-[1.8rem] transition-all group">
                <div className="flex flex-col items-start">
                  <span className="font-black text-slate-900 mb-0.5 text-lg">إدارة الأقسام</span>
                  <span className="text-xs text-slate-500 font-medium">نظم المنيو حسب التصنيفات</span>
                </div>
                <ChevronLeft size={20} className="group-hover:-translate-x-1 text-emerald-500 transition-transform" />
              </Link>
            </div>
          </div>

          {/* رابط المنيو - كرت ملفت وجذاب */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-10 rounded-[2.5rem] text-white shadow-xl shadow-emerald-200/50 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-2 flex items-center gap-2">رابط المنيو الرقمي</h3>
              <p className="text-emerald-50/80 font-medium mb-8">شارك الرابط مع عملائك أو ضعه في حسابات التواصل</p>
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl flex flex-col md:flex-row items-center gap-3 border border-white/20">
                <div className="px-4 py-3 flex-1 font-mono text-sm bg-black/10 rounded-xl truncate w-full">
                  {menuUrl}
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                   <CopyButton text={menuUrl} />
                   <a href={menuUrl} target="_blank" className="p-3.5 bg-white text-emerald-700 rounded-xl hover:bg-emerald-50 transition-all shadow-lg flex items-center justify-center">
                      <ExternalLink size={20} />
                   </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* كود الـ QR - تباين رائع للطباعة */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm shadow-slate-200/40 flex flex-col items-center text-center">
          <h3 className="font-black text-slate-900 mb-8 flex items-center gap-2">
            <QrCode size={22} className="text-emerald-500" /> كود الـ QR
          </h3>
          
          <div className="relative w-full aspect-square max-w-[220px] bg-gray-50 rounded-[2rem] p-6 flex items-center justify-center border border-slate-50">
            {restaurant.qr_code ? (
              <img 
                src={restaurant.qr_code} 
                alt="QR Code" 
                className="w-full h-full object-contain mix-blend-multiply"
              />
            ) : (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            )}
            <div className="absolute -bottom-2 bg-white px-4 py-1 rounded-full shadow-sm border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               Ready to Scan
            </div>
          </div>

          {restaurant.qr_code && (
            <a 
              href={restaurant.qr_code} 
              download={`qr-${restaurant.slug}.png`}
              className="w-full mt-10 bg-slate-900 hover:bg-slate-800 text-white py-4.5 rounded-[1.5rem] font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-slate-200 active:scale-95 group"
            >
              <Download size={20} className="group-hover:translate-y-1 transition-transform" /> تحميل للطباعة
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6 group hover:shadow-md hover:border-emerald-100 transition-all duration-300">
      <div className={`w-16 h-16 ${color} border rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:rotate-6`}>
        {icon}
      </div>
      <div>
        <h3 className="text-slate-400 text-xs font-bold uppercase mb-1 tracking-widest">{title}</h3>
        <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}