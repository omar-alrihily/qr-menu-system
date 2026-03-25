import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import AddProductModal from "./AddProductModal";
import { redirect } from "next/navigation";
import Image from "next/image";

export const dynamic = "force-dynamic";

// تأكد من وجود default و async
export default async function ProductsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await dbConnect();

  try {
    const productsData = await Product.find({ restaurant_id: session.user.id })
      .populate({ path: 'category_id', model: Category })
      .lean();
    
    const categoriesData = await Category.find({ restaurant_id: session.user.id }).lean();

    const products = JSON.parse(JSON.stringify(productsData));
    const categories = JSON.parse(JSON.stringify(categoriesData));

    return (
      <div className="p-6" dir="rtl">
        <div className="flex justify-between mb-6">
           <h1 className="text-2xl font-bold">المنتجات ({products.length})</h1>
           <AddProductModal categories={categories} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <div key={product._id} className="border rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="relative h-40 w-full bg-gray-100">
                {product.image ? (
                  <Image src={product.image} alt={product.name_ar} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">لا توجد صورة</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold">{product.name_ar}</h3>
                <p className="text-green-600 font-bold">{product.price} ريال</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    return <div className="p-10 text-red-500">خطأ في الاتصال بقاعدة البيانات</div>;
  }
}