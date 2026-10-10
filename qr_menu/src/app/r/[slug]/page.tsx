import dbConnect from "@/lib/dbConnect";
import { Restaurant } from "@/models/Restaurant";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Share2, AlertCircle } from "lucide-react";
import MenuContent from "./MenuContent"; 
import { checkSubscriptionStatus } from "@/lib/actions/auth";
import ClassicMenuContent from "./ClassicMenuContent";
import CafeMenuContent from "./CafeMenuContent";  

export const dynamic = "force-dynamic";

export default async function PublicMenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    await dbConnect();
    const restaurantData = await Restaurant.findOne({ slug: slug.toLowerCase() }).lean();
    if (!restaurantData) return notFound();

    // --- فحص حالة الاشتراك ---
    const subStatus = await checkSubscriptionStatus(restaurantData._id.toString());
    
    // تحويل البيانات لـ JSON
    const restaurant = JSON.parse(JSON.stringify(restaurantData));

    const themeStyles = {
      '--primary-color': restaurant.primary_color || '#f97316',
      '--bg-color': restaurant.bg_color || '#F8F9FA',
      '--card-bg': restaurant.card_bg_color || '#ffffff',
      '--text-main': restaurant.text_primary_color || '#111827',
      '--text-sub': restaurant.text_secondary_color || '#6B7280',
    } as React.CSSProperties;

    // --- شاشة انتهاء الاشتراك ---
    if (!subStatus.allowed) {
      return (
        <div style={themeStyles} className="min-h-screen bg-[var(--bg-color)] flex flex-col items-center justify-center p-6 text-center font-[tajawal]" dir="rtl">
           <div className="w-24 h-24 bg-white rounded-[2rem] p-4 shadow-xl mb-6 border-4 border-white">
              <Image 
                src={restaurant.logo || "/logo-placeholder.png"} 
                alt="logo" width={96} height={96} 
                className="object-contain w-full h-full rounded-[1.5rem]" 
              />
           </div>
           <h1 className="text-2xl font-black text-[var(--text-main)] mb-2">{restaurant.name}</h1>
           <div className="bg-white/50 backdrop-blur-md border border-red-100 p-8 rounded-[2.5rem] max-w-sm shadow-sm">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">المنيو غير متوفر</h2>
              <p className="text-gray-500 text-sm font-medium">نعتذر منك، هذا المنيو غير متاح حالياً. يرجى مراجعة صاحب المنشأة.</p>
           </div>
        </div>
      );
    }

    // --- جلب البيانات مع الفرز المزدوج الصحيح للحفاظ على تمركز المنتجات داخل أقسامها ---
    const categoriesData = await Category.find({ restaurant_id: restaurantData._id }).sort({ sort_order: 1 }).lean();
    const productsData = await Product.find({ restaurant_id: restaurantData._id, is_available: true })
      .sort({ category_id: 1, sort_order: 1 })
      .lean();

    const categories = JSON.parse(JSON.stringify(categoriesData));
    const products = JSON.parse(JSON.stringify(productsData));

    return (
      <div 
        style={themeStyles} 
        className="min-h-screen bg-[var(--bg-color)] selection:bg-orange-100 pb-10 font-[tajawal]" 
        dir="rtl"
      >
        {/* --- ترويسة الصفحة العلوية الأنيقة بدون صور غلاف --- */}
        <header className="max-w-2xl mx-auto px-6 pt-8 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="w-10 h-10" /> {/* موازن للمحاذاة */}
            
            {/* الشعار برسم فاخر */}
            <div 
              style={{ backgroundColor: 'var(--card-bg)' }}
              className="w-20 h-20 rounded-2xl p-2 shadow-lg border border-black/5 relative"
            >
              <Image 
                src={restaurant.logo || "/logo-placeholder.png"} 
                alt="logo" width={80} height={80} 
                className="object-contain w-full h-full rounded-xl" 
              />
            </div>

            {/* زر المشاركة */}
            <button className="p-2.5 bg-[var(--card-bg)] shadow-sm rounded-2xl text-gray-400 border border-black/5 hover:bg-gray-50 transition-all active:scale-90">
              <Share2 size={18} />
            </button>
          </div>

          {/* اسم المطعم والفاصل المزخرف */}
          <div className="text-center space-y-2">
            <h1 
              style={{ color: 'var(--text-main)' }} 
              className="text-2xl font-black leading-tight tracking-wide"
            >
              {restaurant.name}
            </h1>
            <div className="flex items-center justify-center gap-2 opacity-60">
              <span className="w-8 h-[1px] bg-[var(--primary-color)]" />
              <span className="text-[var(--primary-color)] text-xs">❖</span>
              <span className="w-8 h-[1px] bg-[var(--primary-color)]" />
            </div>
          </div>
        </header>

        {/* --- الشريط اللاصق للتنقل بين الأقسام --- */}
        <nav className="sticky top-0 z-40 bg-[var(--bg-color)]/90 backdrop-blur-xl border-y border-black/5 py-4 my-4">
          <div className="max-w-2xl mx-auto px-6 overflow-x-auto scrollbar-hide flex items-center gap-3">
            {categories.map((cat: any) => (
              <a 
                key={cat._id} 
                href={`#cat-${cat._id}`} 
                style={{ 
                   color: 'var(--text-main)',
                   backgroundColor: 'var(--card-bg)',
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border border-black/5 shadow-sm hover:border-[var(--primary-color)] hover:scale-105 active:scale-95"
              >
                {cat.name_ar}
              </a>
            ))}
          </div>
        </nav>

        {/* --- محتوى المنيو (القالب المختار) --- */}
       <main className="max-w-2xl mx-auto px-6 mt-6">
          {restaurant.template_style === 'classic' ? (
            <ClassicMenuContent categories={categories} products={products} restaurant={restaurant} />
          ) : restaurant.template_style === 'cafe' ? (
            <CafeMenuContent categories={categories} products={products} restaurant={restaurant} />
          ) : (
            <MenuContent categories={categories} products={products} restaurant={restaurant} />
          )}
        </main>
      </div>
    );
  } catch (error) {
    return <div className="text-center p-20 font-[tajawal]">عذراً، حدث خطأ في تحميل المنيو.</div>;
  }
}