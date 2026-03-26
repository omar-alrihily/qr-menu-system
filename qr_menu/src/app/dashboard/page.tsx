import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { Restaurant } from "@/models/Restaurant";
import Link from "next/link";
import { PlusCircle, Utensils, List, ArrowRight, QrCode, Download, Copy, ExternalLink } from "lucide-react";
import QRCode from "qrcode"; // استيراد المكتبة هنا
import CopyButton from "@/app/dashboard/CopyButton";

export default async function DashboardPage() {
  const session = await auth();
  await dbConnect();

  // 1. جلب بيانات المطعم (بدون .lean() لكي نتمكن من التعديل والحفظ)
  const restaurant = await Restaurant.findOne({ email: session?.user?.email });

  if (!restaurant) {
    return <div className="p-10 text-center font-bold">⚠️ لم يتم العثور على بيانات المطعم.</div>;
  }

  // صيغة الرابط
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const menuUrl = `${baseUrl}/r/${restaurant.slug}`;

  // 2. 🔥 منطق التوليد التلقائي
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

      // حفظ الكود في الداتابيز فوراً
      await Restaurant.findByIdAndUpdate(restaurant._id, { qr_code: generatedQr });
      restaurant.qr_code = generatedQr; // تحديث المتغير الحالي للعرض
    } catch (err) {
      console.error("QR Generation Error:", err);
    }
  }

  const productsCount = await Product.countDocuments({ restaurant_id: restaurant._id });
  const categoriesCount = await Category.countDocuments({ restaurant_id: restaurant._id });

  return (
    <div className="space-y-10 font-sans" dir="rtl">
      <div>
        <h1 className="text-3xl font-black text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-500 mt-1">مرحباً بك في {restaurant.name}</p>
      </div>
      
      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          title="الأقسام" 
          value={categoriesCount.toString()} 
          icon={<List className="text-blue-600" size={24} />}
          color="bg-blue-50" 
        />
        <StatCard 
          title="المنتجات" 
          value={productsCount.toString()} 
          icon={<Utensils className="text-green-600" size={24} />}
          color="bg-green-50" 
        />
        <StatCard 
          title="حالة الرابط" 
          value="نشط" 
          icon={<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />}
          color="bg-emerald-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800">
              <PlusCircle size={20} className="text-blue-600" /> إجراءات سريعة
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/dashboard/products" className="flex items-center justify-between p-5 bg-gray-50 hover:bg-blue-600 hover:text-white rounded-2xl transition-all group">
                <span className="font-bold">إضافة منتج</span>
                <ArrowRight size={18} className="group-hover:translate-x-[-5px] transition-transform" />
              </Link>
              <Link href="/dashboard/categories" className="flex items-center justify-between p-5 bg-gray-50 hover:bg-green-600 hover:text-white rounded-2xl transition-all group">
                <span className="font-bold">إدارة الأقسام</span>
                <ArrowRight size={18} className="group-hover:translate-x-[-5px] transition-transform" />
              </Link>
            </div>
          </div>

          <div className="bg-gray-900 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">رابط المنيو الخاص بك</h3>
              <p className="text-gray-400 text-sm mb-6">هذا هو الرابط الذي تضعه في البايو أو تشاركه مع العملاء</p>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4 border border-white/10">
                <span className="text-sm truncate font-mono text-orange-300 flex-1">{menuUrl}</span>
                <div className="flex gap-2 w-full sm:w-auto">
                   <CopyButton text={menuUrl} />
                   <a href={menuUrl} target="_blank" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                      <ExternalLink size={20} />
                   </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* كود الـ QR المحدث */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <h3 className="font-black text-gray-800 mb-6 flex items-center gap-2">
            <QrCode size={20} className="text-orange-600" /> كود الـ QR
          </h3>
          
          <div className="relative w-48 h-48 bg-white rounded-3xl p-4 shadow-inner border border-gray-100 flex items-center justify-center overflow-hidden">
            {restaurant.qr_code ? (
              <img 
                src={restaurant.qr_code} 
                alt="QR Code" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            )}
          </div>

          {restaurant.qr_code && (
            <a 
              href={restaurant.qr_code} 
              download={`qr-${restaurant.slug}.png`}
              className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <Download size={18} /> تحميل الكود للطباعة
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// مكون StatCard يبقى كما هو في كودك
function StatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-400 text-xs font-bold uppercase mb-1">{title}</h3>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
}