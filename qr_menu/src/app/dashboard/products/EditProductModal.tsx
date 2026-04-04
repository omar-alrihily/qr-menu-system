"use client";
import { useState } from "react";
import { updateProduct } from "@/lib/actions/product";

export default function EditProductModal({ product, categories }: { product: any, categories: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // قائمة مسببات الحساسية المتاحة
  const allergenOptions = [
    { id: 'nuts', label: 'مكسرات' },
    { id: 'milk', label: 'ألبان' },
    { id: 'eggs', label: 'بيض' },
    { id: 'gluten', label: 'جلوتين' },
    { id: 'seafood', label: 'مأكولات بحرية' },
    { id: 'soy', label: 'صويا' },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="text-blue-600 hover:text-blue-800 font-medium text-sm cursor-pointer"
      >
        تعديل
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" dir="rtl">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4 text-right">تعديل المنتج</h2>
            
            <form action={async (fd) => { 
                setLoading(true);
                try {
                  // تحديث: نمرر الـ ID مع الـ FormData التي ستحتوي الآن على الحقول الجديدة تلقائياً
                  const res = await updateProduct(product._id, fd);
                  if(res?.success) {
                    setIsOpen(false);
                  } else {
                    alert(res?.error || "حدث خطأ ما");
                  }
                } finally {
                  setLoading(false);
                }
              }} className="grid grid-cols-2 gap-4 text-right">
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">القسم الرئيسي</label>
                <select name="category_id" defaultValue={product.category_id} required className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name_ar}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">صورة المنتج (اتركها فارغة للإبقاء على الحالية)</label>
                <input name="image" type="file" accept="image/*" className="w-full p-2 border rounded-lg text-sm cursor-pointer" />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالعربي</label>
                <input name="name_ar" defaultValue={product.name_ar} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالإنجليزي</label>
                <input name="name_en" defaultValue={product.name_en} className="w-full p-2 border rounded-lg text-left focus:ring-2 focus:ring-blue-500" required />
              </div>

              {/* حقل السعرات الحرارية الجديد */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">السعرات الحرارية</label>
                <input 
                  name="calories" 
                  type="number" 
                  defaultValue={product.calories || 0} 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">السعر</label>
                <input name="price" type="number" step="0.01" defaultValue={product.price} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>

              {/* حقل مسببات الحساسية الجديد */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">مسببات الحساسية</label>
                <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-lg border">
                  {allergenOptions.map((option) => (
                    <label key={option.id} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        name="allergens" 
                        value={option.id}
                        defaultChecked={product.allergens?.includes(option.id)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                <select name="is_available" defaultValue={product.is_available.toString()} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="true">متوفر</option>
                    <option value="false">غير متوفر</option>
                </select>
              </div>

              <div className="col-span-2 flex gap-3 mt-6">
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`flex-1 text-white py-2.5 rounded-lg font-bold transition-all ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'}`}
                >
                  {loading ? "جاري التحديث..." : "تحديث البيانات"}
                </button>
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}