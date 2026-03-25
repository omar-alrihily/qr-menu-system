import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal"; // المكون الذي سننشئه
import DeleteProductButton from "./DeleteProductButton"; // المكون الذي سننشئه
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
      .sort({ sort_order: 1 }) // ترتيب المنتجات
      .lean();
    
    const categoriesData = await Category.find({ restaurant_id: session.user.id }).lean();

    const products = JSON.parse(JSON.stringify(productsData));
    const categories = JSON.parse(JSON.stringify(categoriesData));

    return (
      <div className="p-6" dir="rtl">
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
           <div>
             <h1 className="text-2xl font-bold text-gray-800">المنتجات ({products.length})</h1>
             <p className="text-gray-500 text-sm">إدارة قائمة الطعام الخاصة بك</p>
           </div>
           <AddProductModal categories={categories} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <div key={product._id} className="group border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all border-gray-100 flex flex-col">
              {/* القسم العلوي: الصورة */}
              <div className="relative h-48 w-full bg-gray-50">
                {product.image ? (
                  <Image src={product.image} alt={product.name_ar} fill className="object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-xs">لا توجد صورة</div>
                )}
                {/* شارة السعر فوق الصورة */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                  <span className="text-green-700 font-bold text-sm">{product.price} ريال</span>
                </div>
              </div>

              {/* القسم الأوسط: البيانات */}
              <div className="p-4 flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-800 truncate" title={product.name_ar}>{product.name_ar}</h3>
                </div>
                <p className="text-xs text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded-md mb-2">
                  {product.category_id?.name_ar || "بدون قسم"}
                </p>
                <p className="text-gray-500 text-xs line-clamp-2 h-8">
                  {product.description_ar || "لا يوجد وصف لهذا المنتج"}
                </p>
              </div>

              {/* القسم السفلي: أزرار التحكم */}
              <div className="p-4 pt-0 border-t border-gray-50 flex items-center justify-between mt-auto">
                <EditProductModal product={product} categories={categories} />
                <div className="h-4 w-[1px] bg-gray-200"></div>
                <DeleteProductButton id={product._id} />
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400">لا يوجد منتجات حالياً، ابدأ بإضافة أول منتج!</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    return <div className="p-10 text-red-500 text-center font-bold">⚠️ خطأ في الاتصال بقاعدة البيانات</div>;
  }
}