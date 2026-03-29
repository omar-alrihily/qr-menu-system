import dbConnect from "@/lib/dbConnect";
import { Restaurant } from "@/models/Restaurant";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Share2 } from "lucide-react";
import MenuContent from "./MenuContent"; 

export const dynamic = "force-dynamic";

export default async function PublicMenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    await dbConnect();
    const restaurantData = await Restaurant.findOne({ slug: slug.toLowerCase() }).lean();
    if (!restaurantData) return notFound();

    const categoriesData = await Category.find({ restaurant_id: restaurantData._id }).sort({ sort_order: 1 }).lean();
    const productsData = await Product.find({ restaurant_id: restaurantData._id, is_available: true }).sort({ sort_order: 1 }).lean();

    const restaurant = JSON.parse(JSON.stringify(restaurantData));
    const categories = JSON.parse(JSON.stringify(categoriesData));
    const products = JSON.parse(JSON.stringify(productsData));

    // 1. تعريف كافة متغيرات الألوان القادمة من الإعدادات الجديدة
    const themeStyles = {
      '--primary-color': restaurant.primary_color || '#f97316',
      '--bg-color': restaurant.bg_color || '#F8F9FA',
      '--card-bg': restaurant.card_bg_color || '#ffffff',
      '--text-main': restaurant.text_primary_color || '#111827',
      '--text-sub': restaurant.text_secondary_color || '#6B7280',
    } as React.CSSProperties;

    return (
      <div 
        style={themeStyles} 
        className="min-h-screen bg-[var(--bg-color)] selection:bg-orange-100 pb-10" 
        dir="rtl"
      >
      {/* --- Hero Section --- */}
{restaurant.show_cover !== false ? (
  <header className="relative w-full aspect-[16/7] md:aspect-[21/7] overflow-hidden bg-gray-100 animate-in fade-in duration-500">
    <Image 
      src={restaurant.cover_image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836"} 
      alt="cover" 
      fill 
      className="object-cover object-center transition-transform duration-700 hover:scale-105" 
      priority
      sizes="100vw"
    />
    
    {/* تدرج لوني أنعم */}
    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-black/5 to-black/30 z-10" />
    
    <div className="absolute top-6 left-0 right-0 z-20 px-6 flex justify-between items-center">
      <button className="p-3 bg-white/20 backdrop-blur-xl rounded-2xl text-white border border-white/20 hover:bg-white/30 transition-all active:scale-90 shadow-lg">
        <Share2 size={18} />
      </button>
    </div>
  </header>
) : (
  /* في حالة إخفاء الغلاف، نظهر فقط زر المشاركة بشكل أنيق وبسيط */
  <div className="h-20 flex justify-between items-center px-6 pt-6">
    <div /> {/* موازنة الفراغ */}
    <button className="p-3 bg-white shadow-sm rounded-2xl text-gray-400 border border-gray-100 hover:bg-gray-50 transition-all active:scale-90">
      <Share2 size={18} />
    </button>
  </div>
)}

{/* --- Brand Info Section --- */}
{/* التعديل هنا: نتحكم في الهامش العلوي بناءً على وجود الغلاف */}
<div className={`max-w-2xl mx-auto px-5 relative z-30 transition-all duration-500 ${restaurant.show_cover !== false ? '-mt-20' : 'mt-4'}`}>
  {/* باقي كود اللوجو واسم المطعم ... */}
</div>

        {/* --- Brand Card --- */}
        <div className="max-w-2xl mx-auto px-5 -mt-20 relative z-30">
          <div 
            style={{ backgroundColor: 'var(--card-bg)' }}
            className="backdrop-blur-2xl rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-6 border border-white/50"
          >
            <div className="flex flex-col items-center text-center">
              <div 
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--bg-color)' }}
                className="w-24 h-24 rounded-[2rem] p-1.5 shadow-2xl -mt-20 mb-4 border-4 relative"
              >
                <Image 
                  src={restaurant.logo || "/logo-placeholder.png"} 
                  alt="logo" width={96} height={96} 
                  className="object-contain w-full h-full rounded-[1.5rem]" 
                />
              </div>
              <h1 
                style={{ color: 'var(--text-main)' }} 
                className="text-2xl font-black mb-2 leading-tight"
              >
                {restaurant.name}
              </h1>
              <div 
                style={{ color: 'var(--text-sub)' }}
                className="flex flex-wrap justify-center items-center gap-4 text-[11px] font-bold uppercase tracking-wide"
              >
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} style={{ color: 'var(--primary-color)' }} />  المملكة العربية السعودية
                </span>
              </div>
              <div className="grid grid-cols-2 gap-0 w-full mt-6 pt-6 border-t border-gray-100/80"></div>
            </div>
          </div>
        </div>

        {/* --- Categories (Navigation) --- */}
        <nav className="sticky top-0 z-40 bg-[var(--bg-color)]/80 backdrop-blur-xl border-b border-gray-100 py-5 mt-8">
          <div className="max-w-2xl mx-auto px-6 overflow-x-auto scrollbar-hide flex items-center gap-3">
            {categories.map((cat: any) => (
              <a 
                key={cat._id} 
                href={`#cat-${cat._id}`} 
                style={{ 
                   color: 'var(--text-main)',
                   backgroundColor: 'var(--card-bg)',
                   borderColor: 'rgba(0,0,0,0.05)' 
                }}
                className="px-6 py-2.5 rounded-2xl text-[13px] font-black transition-all whitespace-nowrap border-2 shadow-sm hover:border-[var(--primary-color)] hover:scale-105 active:scale-95"
              >
                {cat.name_ar}
              </a>
            ))}
          </div>
        </nav>

        {/* --- Content --- */}
        <main className="max-w-2xl mx-auto px-6 mt-8">
          {/* نمرر الـ restaurant كاملاً لـ MenuContent لاستخدام الألوان هناك أيضاً */}
          <MenuContent categories={categories} products={products} restaurant={restaurant} />
        </main>
      </div>
    );
  } catch (error) {
    return <div className="text-center p-20">عذراً، حدث خطأ في تحميل المنيو.</div>;
  }
}