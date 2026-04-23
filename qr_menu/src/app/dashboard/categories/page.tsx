import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { Category } from "@/models/Category";
import CategoryRow from "./CategoryRow"; // سننشئه الآن
import AddCategoryModal from "./AddCategoryModal"; // المودال الذي صممناه سابقاً

export default async function CategoriesPage() {
  const session = await auth();
  await dbConnect();
  
  // جلب الأقسام الخاصة بهذا المطعم فقط
  const categories = await Category.find({ restaurant_id: session?.user?.id }).sort({ sort_order: 1 });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">إدارة الأقسام</h1>
        <AddCategoryModal />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
            <tr>
              <th className="p-4">الاسم (عربي)</th>
              <th className="p-4 text-center">الترتيب</th>
              <th className="p-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <CategoryRow key={cat._id.toString()} category={JSON.parse(JSON.stringify(cat))} />
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-400">لا توجد أقسام مضافة بعد.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}