import dbConnect from "@/lib/dbConnect";
import { Restaurant } from "@/models/Restaurant";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Clock, MapPin, Share2 } from "lucide-react"; // تمت إزالة Search و Star
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

    return (
      <div className="min-h-screen bg-[#F8F9FA]  selection:bg-orange-100 pb-10" dir="rtl">
        
        {/* --- Hero Section --- */}
        <header className="relative h-[32vh] w-full overflow-hidden">
          <Image 
            src={restaurant.cover_image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836"} 
            alt="cover" fill className="object-cover transition-transform duration-700 hover:scale-110" priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FA] via-black/10 to-black/40 z-10" />
          
          <div className="absolute top-6 left-0 right-0 z-20 px-6 flex justify-between items-center">
            <button className="p-3 bg-white/20 backdrop-blur-xl rounded-2xl text-white border border-white/20 hover:bg-white/30 transition-all active:scale-90">
              <Share2 size={18} />
            </button>
           
          </div>
        </header>

        {/* --- Brand Card --- */}
        <div className="max-w-2xl mx-auto px-5 -mt-20 relative z-30">
          <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-6 border border-white/50">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-[2rem] p-1.5 shadow-2xl -mt-20 mb-4 border-4 border-[#F8F9FA] relative">
                <Image 
                  src={restaurant.logo || "/logo-placeholder.png"} 
                  alt="logo" width={96} height={96} 
                  className="object-contain w-full h-full rounded-[1.5rem]" 
                />
              </div>
              <h1 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{restaurant.name}</h1>
              <div className="flex flex-wrap justify-center items-center gap-4 text-gray-500 text-[11px] font-bold uppercase tracking-wide">
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-orange-500" /> حي الملقا، الرياض</span>
                {/* تم حذف خانة التقييم من هنا */}
              </div>
              <div className="grid grid-cols-2 gap-0 w-full mt-6 pt-6 border-t border-gray-100/80">
               
               
              </div>
            </div>
          </div>
        </div>

        {/* تم حذف قسم البحث بالكامل من هنا */}

        {/* --- Categories (Navigation) --- */}
        <nav className="sticky top-0 z-40 bg-[#F8F9FA]/80 backdrop-blur-xl border-b border-gray-100 py-5 mt-8">
         <div className="max-w-2xl mx-auto px-6 overflow-x-auto scrollbar-hide flex items-center gap-3">
  {categories.map((cat: any) => (
    <a 
      key={cat._id} 
      href={`#cat-${cat._id}`} 
      className="px-6 py-2.5 rounded-2xl text-[13px] font-black transition-all whitespace-nowrap border-2 bg-white text-gray-500 border-gray-50 hover:border-orange-100 hover:text-orange-600 shadow-sm"
    >
      {cat.name_ar}
    </a>
  ))}
</div>
        </nav>

        {/* --- Content --- */}
        <main className="max-w-2xl mx-auto px-6 mt-8">
          <MenuContent categories={categories} products={products} restaurant={restaurant} />
        </main>
      </div>
    );
  } catch (error) {
    return <div className="text-center p-20">عذراً، حدث خطأ في تحميل المنيو.</div>;
  }
}