"use client";

import { useState } from "react";
import { createCategory } from "@/lib/actions/category";

export default function AddCategoryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // دالة التعامل مع الإرسال
  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await createCategory(formData);
    setLoading(false);
    
    if (result.success) {
      setIsOpen(false); // إغلاق النافذة عند النجاح
    } else {
      alert(result.error || "حدث خطأ ما");
    }
  }

  return (
    <>
      {/* زر فتح النافذة */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all shadow-md font-medium cursor-pointer"
      >
        + إضافة قسم جديد
      </button>

      {/* النافذة المنبثقة (Modal) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* الخلفية المظلمة */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* محتوى النافذة */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-200" dir="rtl">
            <h2 className="text-xl font-bold text-gray-800 mb-6">إضافة قسم منيو جديد</h2>

            <form action={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالعربي</label>
                <input
                  name="name_ar"
                  required
                  placeholder="مثال: البيتزا الإيطالية"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">الاسم بالإنجليزي (English Name)</label>
                <input
                  name="name_en"
                  required
                  placeholder="Example: Italian Pizza"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-left"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ترتيب الظهور</label>
                <input
                  name="sort_order"
                  type="number"
                  defaultValue="0"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all disabled:bg-blue-300 cursor-pointer"
                >
                  {loading ? "جاري الحفظ..." : "حفظ القسم"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-3 rounded-xl font-bold transition-all cursor-pointer"
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