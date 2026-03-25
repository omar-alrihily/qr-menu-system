import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Sidebar - القائمة الجانبية */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-l border-gray-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-bold text-blue-600">لوحة المنيو</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition">
            الرئيسية
          </Link>
          <Link href="/dashboard/categories" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition">
            الأقسام
          </Link>
          <Link href="/dashboard/products" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition">
            المنتجات
          </Link>
          <Link href="/dashboard/settings" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition">
            إعدادات المطعم
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <form action={async () => { "use server"; await signOut(); }}>
            <button className="w-full text-right px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition">
              تسجيل الخروج
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content - المحتوى الأساسي */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="text-sm text-gray-500">
            مرحباً بك، <span className="font-semibold text-gray-800">{session.user?.name}</span>
          </div>
          <div className="flex items-center gap-4">
             {/* هنا يمكنك إضافة زر لمعاينة المنيو الحقيقي */}
             <Link href={`/menu/${session.user?.id}`} className="text-sm bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition">
                معاينة المنيو ↗
             </Link>
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}