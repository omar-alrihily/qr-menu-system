import dbConnect from "@/lib/dbConnect";
import { Restaurant } from "@/models/Restaurant";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Phone, Clock, Star, Plus, Info, ChevronRight } from "lucide-react";

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
      <div className="min-h-screen bg-[#F8F9FA] font-sans pb-20 selection:bg-orange-100" dir="rtl">
        
        {/* --- Header Section --- */}
        <header className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
          <Image 
            src={restaurant.cover_image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070"} 
            alt="cover" fill className="object-cover scale-105" priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
          
          <div className="absolute bottom-0 left-0 right-0 z-20 p-6 text-white">
            <div className="max-w-2xl mx-auto flex items-end gap-5">
              <div className="relative group">
                <div className="w-24 h-24 bg-white rounded-3xl p-1 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-300">
                  <Image src={restaurant.logo || "/logo-placeholder.png"} alt="logo" width={96} height={96} className="object-contain w-full h-full rounded-2xl" />
                </div>
              </div>
              <div className="flex-1 pb-2">
                <h1 className="text-3xl font-black tracking-tight mb-2">{restaurant.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                  <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    <Clock size={14} className="text-orange-400" /> 25-35 دقيقة
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" /> 4.9 (120+)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* --- Categories Navigation --- */}
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm scrollbar-hide overflow-x-auto">
          <div className="max-w-2xl mx-auto flex items-center gap-3 p-4 px-6">
            {categories.map((cat: any) => (
              <a 
                key={cat._id} 
                href={`#cat-${cat._id}`}
                className="px-6 py-2.5 bg-white border border-gray-100 rounded-2xl text-[14px] font-bold text-gray-500 whitespace-nowrap hover:border-orange-500 hover:text-orange-600 transition-all active:scale-95 shadow-sm"
              >
                {cat.name_ar}
              </a>
            ))}
          </div>
        </nav>

        {/* --- Main Content --- */}
        <main className="max-w-2xl mx-auto px-5 mt-10 space-y-16">
          {categories.map((cat: any) => {
            const catProducts = products.filter((p: any) => p.category_id === cat._id);
            if (catProducts.length === 0) return null;

            return (
              <section key={cat._id} id={`cat-${cat._id}`} className="scroll-mt-24">
                <div className="flex items-center justify-between mb-8 group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-orange-500 rounded-full" />
                    <h2 className="text-2xl font-black text-gray-800">{cat.name_ar}</h2>
                  </div>
                  <span className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-lg">
                    {catProducts.length} صنف
                  </span>
                </div>

                <div className="grid gap-5">
                  {catProducts.map((product: any) => (
                    <div 
                      key={product._id} 
                      className="group bg-white rounded-[2.5rem] p-4 flex gap-4 shadow-sm border border-transparent hover:border-orange-100 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300"
                    >
                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between py-1 pr-1">
                        <div>
                          <h3 className="font-bold text-gray-900 text-[1.1rem] mb-1 group-hover:text-orange-600 transition-colors">
                            {product.name_ar}
                          </h3>
                          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                            {product.description_ar || "تجربة طعم لا تُنسى محضرة بعناية فائقة من أجود المكونات."}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">السعر</span>
                            <span className="text-xl font-black text-gray-900">
                              {product.price} <small className="text-[10px] text-orange-600 mr-0.5">ر.س</small>
                            </span>
                          </div>
                          
                          <button className="h-12 w-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center hover:bg-orange-600 transition-all active:scale-90 shadow-lg shadow-orange-200">
                            <Plus size={24} strokeWidth={3} />
                          </button>
                        </div>
                      </div>

                      {/* Product Image */}
                      {product.image && (
                        <div className="relative w-36 h-36 shrink-0 rounded-[2rem] overflow-hidden shadow-md">
                          <Image 
                            src={product.image} 
                            alt={product.name_ar} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </main>

        {/* --- Floating Actions --- */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-4 px-6 z-50">
           {/* WhatsApp Button */}
          <a 
            href={`https://wa.me/${restaurant.whatsapp}`} 
            target="_blank"
            className="flex items-center gap-3 bg-green-500 text-white px-6 py-4 rounded-full shadow-[0_10px_30px_rgba(34,197,94,0.4)] hover:scale-105 active:scale-95 transition-all"
          >
            <Phone size={20} fill="currentColor" />
            <span className="font-bold text-sm">اطلب عبر واتساب</span>
          </a>

          {/* Info Button */}
          <button className="w-14 h-14 bg-white text-gray-900 rounded-full flex items-center justify-center shadow-xl border border-gray-100 hover:bg-gray-50 transition-all">
            <Info size={24} />
          </button>
        </div>

      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center space-y-4">
        <div className="text-6xl text-orange-200">🍽️</div>
        <h2 className="text-xl font-bold text-gray-800">عذراً، المنيو غير متوفر حالياً</h2>
        <p className="text-gray-500">نواجه بعض الصعوبات التقنية، نرجو المحاولة لاحقاً.</p>
      </div>
    );
  }
}