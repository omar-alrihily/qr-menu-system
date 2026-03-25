import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import Link from "next/link";
import { PlusCircle, Utensils, List, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  await dbConnect();

  // جلب الأرقام الحقيقية من الداتابيز
  const productsCount = await Product.countDocuments({ restaurant_id: session?.user?.id });
  const categoriesCount = await Category.countDocuments({ restaurant_id: session?.user?.id });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">نظرة عامة</h1>
        <p className="text-gray-500 mt-1">إليك ما يحدث في مطعمك اليوم</p>
      </div>
      
      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          title="إجمالي الأقسام" 
          value={categoriesCount.toString()} 
          icon={<List className="text-blue-600" size={24} />}
          color="bg-blue-50" 
        />
        <StatCard 
          title="إجمالي المنتجات" 
          value={productsCount.toString()} 
          icon={<Utensils className="text-green-600" size={24} />}
          color="bg-green-50" 
        />
        <StatCard 
          title="حالة المنيو" 
          value="نشط" 
          icon={<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />}
          color="bg-purple-50" 
        />
      </div>

      {/* إجراءات سريعة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800">
            <PlusCircle size={20} className="text-blue-600" />
            إجراءات سريعة
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/dashboard/products" className="flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all group">
              <span className="font-medium">إضافة منتج جديد</span>
              <ArrowRight size={18} className="-rotate-45 group-hover:rotate-0 transition-transform" />
            </Link>
            <Link href="/dashboard/categories" className="flex items-center justify-between p-4 bg-gray-50 hover:bg-green-600 hover:text-white rounded-xl transition-all group">
              <span className="font-medium">إدارة الأقسام</span>
              <ArrowRight size={18} className="-rotate-45 group-hover:rotate-0 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-2xl text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">رابط المنيو الخاص بك</h3>
            <p className="text-blue-100 text-sm mb-6">قم بنسخ الرابط ووضعه في البايو أو طباعة QR Code للطاولات</p>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg flex items-center justify-between border border-white/20">
              <span className="text-xs truncate opacity-80">yourdomain.com/menu/{session?.user?.id}</span>
              <button className="bg-white text-blue-700 px-4 py-1.5 rounded-md text-xs font-bold hover:bg-blue-50">نسخ</button>
            </div>
          </div>
          <Utensils className="absolute -bottom-6 -right-6 text-white/10" size={150} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-black text-gray-800">{value}</p>
      </div>
    </div>
  );
}