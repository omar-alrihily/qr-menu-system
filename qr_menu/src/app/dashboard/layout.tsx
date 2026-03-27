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
  User,
  ChevronLeft
} from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  await dbConnect();
  const restaurant = await Restaurant.findOne({ email: session.user?.email }).select("slug").lean();

  const menuItems = [
    { name: "الرئيسية", href: "/dashboard", icon: LayoutDashboard },
    { name: "الأقسام", href: "/dashboard/categories", icon: Layers },
    { name: "المنتجات", href: "/dashboard/products", icon: Utensils },
    { name: "إعدادات المطعم", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] font-[tajawal] text-slate-900" dir="rtl">
      
      {/* Sidebar - تصميم فاتح، بسيط وأنيق */}
      <aside className="hidden md:flex w-72 flex-col bg-white border-l border-slate-100 sticky top-0 h-screen shadow-[10px_0_30px_rgba(0,0,0,0.02)]">
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-slate-900 rounded-2xl rotate-3 flex items-center justify-center text-white shadow-xl shadow-slate-200 group-hover:rotate-0 transition-all duration-500">
               <Utensils size={22} className="text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-black text-slate-950 leading-tight">لوحة المنيو</h2>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">التحول الرقمي</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5">
          {menuItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="flex items-center justify-between px-5 py-3.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl transition-all duration-300 group font-bold text-sm"
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className="group-hover:scale-110 transition-transform opacity-70 group-hover:opacity-100" />
                <span>{item.name}</span>
              </div>
              <ChevronLeft size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-50">
          <form 
            action={async () => { 
              "use server"; 
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="flex items-center gap-3 w-full px-5 py-3.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold text-sm group">
              <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
              تسجيل الخروج
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header - ناصع البياض مع تفاعلات ناعمة */}
        <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 flex items-center justify-between px-6 md:px-10">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
               <User size={18} />
             </div>
             <div className="hidden sm:flex flex-col">
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">المسؤول</span>
               <span className="text-sm font-black text-slate-900 underline underline-offset-4 decoration-emerald-100">{session.user?.name}</span>
             </div>
          </div>
          
          {restaurant?.slug && (
            <Link 
              href={`/r/${restaurant.slug}`} 
              target="_blank"
              className="group flex items-center gap-2 text-sm font-black bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200 active:scale-95"
            >
              <span className="hidden md:inline">معاينة المنيو </span>
              <span className="md:hidden">معاينة</span>
              <ExternalLink size={16} className="group-hover:translate-y-[-2px] group-hover:translate-x-[1px] transition-transform" />
            </Link>
          )}
        </header>

        {/* محتوى الصفحة */}
        <main className="p-6 md:p-10 w-full font-[tajawal] max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-3 duration-700">
          {children}
        </main>
      </div>
    </div>
  );
}