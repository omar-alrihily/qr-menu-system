"use client";
import { useState } from "react";
import { createProduct } from "@/lib/actions/product";

export default function AddProductModal({ categories }: { categories: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false); // حالة التحميل

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
      >
        + إضافة منتج جديد
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" dir="rtl">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">إضافة منتج جديد للمنيو</h2>
            
            <form action={async (fd) => { 
                setLoading(true); // بدء التحميل
                try {
                  const res = await createProduct(fd);
                  if(res?.success) {
                    setIsOpen(false);
                  } else {
                    alert(res?.error || "حدث خطأ ما");
                  }
                } finally {
                  setLoading(false); // إنهاء التحميل
                }
              }} className="grid grid-cols-2 gap-4">
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">القسم الرئيسي</label>
                <select name="category_id" required className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">اختر القسم...</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name_ar}</option>
                  ))}
                </select>
              </div>

              {/* حقل رفع الصورة الجديد */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">صورة المنتج</label>
                <input 
                  name="image" 
                  type="file" 
                  accept="image/*" 
                  className="w-full p-2 border rounded-lg text-sm file:ml-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالعربي</label>
                <input name="name_ar" placeholder="مثلاً: كبسة دجاج" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500" required />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالإنجليزي</label>
                <input name="name_en" placeholder="Chicken Kabsa" className="w-full p-2 border rounded-lg text-left focus:ring-2 focus:ring-green-500" required />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">وصف المنتج (عربي)</label>
                <textarea name="description_ar" placeholder="مكونات الوجبة..." className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500" rows={2} />
              </div>
              
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">السعر</label>
                <input name="price" type="number" step="0.01" placeholder="0.00" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500" required />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">الترتيب</label>
                <input name="sort_order" type="number" placeholder="0" defaultValue="0" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>

              <div className="col-span-2 flex gap-3 mt-6">
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`flex-1 text-white py-2.5 rounded-lg font-bold transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 cursor-pointer'}`}
                >
                  {loading ? "جاري الرفع والحفظ..." : "حفظ المنتج"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)} 
                  className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-lg hover:bg-gray-200 transition-all cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}