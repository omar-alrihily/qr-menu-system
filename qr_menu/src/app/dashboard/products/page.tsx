import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import DeleteProductButton from "./DeleteProductButton";
import { redirect } from "next/navigation";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await dbConnect();

  try {
    const productsData = await Product.find({ restaurant_id: session.user.id })
      .populate({ path: 'category_id', model: Category })
      .sort({ sort_order: 1 })
      .lean();
    
    const categoriesData = await Category.find({ restaurant_id: session.user.id }).lean();

    const products = JSON.parse(JSON.stringify(productsData));
    const categories = JSON.parse(JSON.stringify(categoriesData));

    // مساعد لترجمة مسببات الحساسية للعرض في لوحة التحكم
    const getAllergenLabel = (id: string) => {
      const labels: Record<string, string> = {
        nuts: 'مكسرات', milk: 'ألبان', eggs: 'بيض', 
        gluten: 'جلوتين', seafood: 'بحريات', soy: 'صويا'
      };
      return labels[id] || id;
    };

    return (
      <div className="p-6" dir="rtl">
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
           <div>
             <h1 className="text-2xl font-bold text-gray-800">المنتجات ({products.length})</h1>
             <p className="text-gray-500 text-sm">إدارة قائمة الطعام وتفاصيلها</p>
           </div>
           <AddProductModal categories={categories} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <div key={product._id} className="group border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all border-gray-100 flex flex-col">
              <div className="relative h-48 w-full bg-gray-50">
                {product.image ? (
                  <Image src={product.image} alt={product.name_ar} fill className="object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-xs">لا توجد صورة</div>
                )}
                
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <span className="text-green-700 font-black text-sm">{product.price}</span>
                  <span className="text-[10px] text-green-600 font-bold">ر.س</span>
                </div>

                {/* شارة السعرات الحرارية على الصورة */}
                {product.calories > 0 && (
                  <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-lg shadow-sm text-[10px] font-bold">
                    {product.calories} Cal
                  </div>
                )}
              </div>

              <div className="p-4 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800 truncate" title={product.name_ar}>{product.name_ar}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${product.is_available ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                    {product.is_available ? 'متوفر' : 'نفذت'}
                  </span>
                </div>
                
                <p className="text-[10px] text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded-md mb-3 font-medium">
                  {product.category_id?.name_ar || "بدون قسم"}
                </p>

                {/* عرض مسببات الحساسية بشكل مبسط */}
                {product.allergens && product.allergens.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.allergens.map((alg: string) => (
                      <span key={alg} className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md border border-gray-200">
                        {getAllergenLabel(alg)}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-gray-400 text-[11px] line-clamp-2 h-8 leading-relaxed">
                  {product.description_ar || "لا يوجد وصف لهذا المنتج"}
                </p>
              </div>

              <div className="p-4 pt-0 border-t border-gray-50 flex items-center justify-between mt-auto">
                <div className="flex-1 text-center">
                  <EditProductModal product={product} categories={categories} />
                </div>
                <div className="h-4 w-[1px] bg-gray-200"></div>
                <div className="flex-1 text-center">
                  <DeleteProductButton id={product._id} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image src="/empty-cart.png" alt="Empty" width={32} height={32} className="opacity-20" />
            </div>
            <p className="text-gray-400 font-medium">قائمة الطعام فارغة، ابدأ بإضافة نكهاتك الخاصة!</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    return <div className="p-10 text-red-500 text-center font-bold">⚠️ خطأ في الاتصال بقاعدة البيانات</div>;
  }
}