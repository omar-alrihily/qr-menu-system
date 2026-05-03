import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import dbConnect from "@/lib/dbConnect";
import { Restaurant } from "@/models/Restaurant";
import { checkSubscriptionStatus } from "@/lib/actions/auth"; 
import { 
  LayoutDashboard, 
  Utensils, 
  Layers, 
  Settings, 
  LogOut, 
  ExternalLink,
  User,
  ChevronLeft,
  AlertCircle,
  Clock
} from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  await dbConnect();
  
  // 1. جلب بيانات المطعم
  let restaurant = await Restaurant.findOne({ email: session.user?.email });
  if (!restaurant) redirect("/login");

  // 2. كود الإصلاح التلقائي: إذا كان الحساب قديماً ولا يملك تاريخ انتهاء، نمنحه 30 يوماً فوراً
  if (!restaurant.trialEndsAt) {
    restaurant.trialEndsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    restaurant.subscriptionStatus = 'trial';
    await restaurant.save();
  }

  // 3. التحقق من حالة الاشتراك الحقيقية
  const subStatus = await checkSubscriptionStatus(restaurant._id.toString());

  const menuItems = [
    { name: "الرئيسية", href: "/dashboard", icon: LayoutDashboard },
    { name: "الأقسام", href: "/dashboard/categories", icon: Layers },
    { name: "المنتجات", href: "/dashboard/products", icon: Utensils },
    { name: "الإعدادات", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] font-[tajawal] text-slate-900" dir="rtl">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 flex-col bg-white border-l border-slate-100 sticky top-0 h-screen shadow-[10px_0_30px_rgba(0,0,0,0.02)]">
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
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
            <button className="flex items-center gap-3 w-full px-5 py-3.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold text-sm group">
              <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
              تسجيل الخروج
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        
        {/* شريط التنبيه (Banner) */}
        {subStatus.allowed && subStatus.isTrial && (
          <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center justify-center gap-2 text-amber-800 text-xs sm:text-sm font-bold">
            <Clock size={16} className="animate-pulse" />
            <span>أنت في الفترة التجريبية، ينتهي وصولك خلال {subStatus.daysLeft} يوم.</span>
            <Link href="/dashboard/settings" className="underline hover:text-amber-950 mr-2">اشترك الآن</Link>
          </div>
        )}

        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 flex items-center justify-between px-4 md:px-10">
          <div className="flex items-center gap-3">
              <div className="lg:hidden w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                 <Utensils size={18} className="text-emerald-400" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl hidden sm:flex items-center justify-center text-slate-400 border border-slate-100">
                  <User size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-1">المسؤول</span>
                  <span className="text-sm font-black text-slate-900 truncate max-w-[100px] sm:max-w-none">
                    {session.user?.name}
                  </span>
                </div>
              </div>
          </div>
          
          {restaurant?.slug && subStatus.allowed && (
            <Link 
              href={`/r/${restaurant.slug}`} 
              target="_blank"
              className="group flex items-center gap-2 text-sm font-black bg-slate-900 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
            >
              <span className="hidden sm:inline">معاينة المنيو</span>
              <span className="sm:hidden text-xs">معاينة</span>
              <ExternalLink size={14} className="group-hover:translate-y-[-1px] transition-transform" />
            </Link>
          )}
        </header>

        {/* Content Area */}
        <main className="p-4 md:p-10 w-full font-[tajawal] max-w-7xl mx-auto mb-24 lg:mb-0 animate-in fade-in slide-in-from-bottom-3 duration-700">
          {subStatus.allowed ? children : (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-inner">
                <AlertCircle size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900">انتهت صلاحية الوصول</h2>
                <p className="text-slate-500 max-w-sm mx-auto font-medium">
                  نأسف، ولكن اشتراكك الحالي قد انتهى. يرجى التجديد لتتمكن من إدارة منيو مطعمك مرة أخرى.
                </p>
              </div>
              <Link 
  href="https://wa.me/966549262671" 
  target="_blank" 
  className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200"
>
  تجديد الاشتراك الآن
</Link>
            </div>
          )}
        </main>

        {/* Mobile Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-2 py-3 z-50 flex justify-around items-center shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
          {menuItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="flex flex-col items-center gap-1 px-3 py-1 text-slate-400 hover:text-emerald-600 transition-colors"
            >
              <item.icon size={20} />
              <span className="text-[10px] font-bold">{item.name}</span>
            </Link>
          ))}
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
            <button className="flex flex-col items-center gap-1 px-3 py-1 text-slate-400 hover:text-red-500 transition-colors">
              <LogOut size={20} />
              <span className="text-[10px] font-bold">خروج</span>
            </button>
          </form>
        </nav>
      </div>
    </div>
  );
}