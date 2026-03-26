import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import dbConnect from "@/lib/dbConnect";
import { Restaurant } from "@/models/Restaurant";
import { 
  LayoutDashboard, 
  Utensils, 
  Layers, 
  Settings, 
  LogOut, 
  ExternalLink,
  User
} from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  // 1. الاتصال بقاعدة البيانات وجلب بيانات المطعم للحصول على الـ slug
  await dbConnect();
  const restaurant = await Restaurant.findOne({ email: session.user?.email }).select("slug").lean();

  const menuItems = [
    { name: "الرئيسية", href: "/dashboard", icon: LayoutDashboard },
    { name: "الأقسام", href: "/dashboard/categories", icon: Layers },
    { name: "المنتجات", href: "/dashboard/products", icon: Utensils },
    { name: "إعدادات المطعم", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans" dir="rtl">
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 flex-col bg-white border-l border-gray-200 shadow-sm">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
               <Utensils size={24} />
            </div>
            <h2 className="text-xl font-black text-gray-800 tracking-tight">لوحة المنيو</h2>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 group"
            >
              <item.icon size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <form action={async () => { "use server"; await signOut(); }}>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium">
              <LogOut size={20} />
              تسجيل الخروج
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 flex items-center justify-between px-8">
          <div className="flex items-center gap-3">
             <div className="bg-gray-100 p-2 rounded-full"><User size={18} className="text-gray-600" /></div>
             <div className="flex flex-col">
               <span className="text-xs text-gray-400 font-medium tracking-wide">مرحباً بك</span>
               <span className="text-sm font-bold text-gray-800">{session.user?.name}</span>
             </div>
          </div>
          
          {/* الرابط المعدل باستخدام الـ slug */}
          {restaurant?.slug && (
            <Link 
              href={`/r/${restaurant.slug}`} 
              target="_blank"
              className="flex items-center gap-2 text-sm font-bold bg-orange-600 text-white px-6 py-2.5 rounded-2xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 active:scale-95"
            >
              <span>معاينة المنيو</span>
              <ExternalLink size={14} />
            </Link>
          )}
        </header>

        <main className="p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}