"use client";

import { useState } from "react";
import { createProduct } from "@/lib/actions/product";

export default function AddProductModal({ categories }: { categories: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // مفتاح تفعيل/تعطيل ميزة الأحجام
  const [hasSizes, setHasSizes] = useState(false);
  const [sizes, setSizes] = useState<{ name: string; price: number }[]>([]);
  const [options, setOptions] = useState<{ name: string; price: number }[]>([]);

  const addSize = () => setSizes([...sizes, { name: "", price: 0 }]);
  const removeSize = (index: number) => setSizes(sizes.filter((_, i) => i !== index));
  const updateSize = (index: number, field: "name" | "price", value: string | number) => {
    const newSizes = [...sizes];
    if (field === "name") newSizes[index].name = value as string;
    if (field === "price") newSizes[index].price = Number(value);
    setSizes(newSizes);
  };

  const addOption = () => setOptions([...options, { name: "", price: 0 }]);
  const removeOption = (index: number) => setOptions(options.filter((_, i) => i !== index));
  const updateOption = (index: number, field: "name" | "price", value: string | number) => {
    const newOptions = [...options];
    if (field === "name") newOptions[index].name = value as string;
    if (field === "price") newOptions[index].price = Number(value);
    setOptions(newOptions);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer font-bold text-sm"
      >
        + إضافة منتج جديد
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" dir="rtl">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">إضافة منتج جديد للمنيو</h2>
            
            <form action={async (fd) => { 
                setLoading(true);
                // إذا لم تكن مفعلة، نرسل مصفوفة فارغة للأحجام
                fd.append("sizes", JSON.stringify(hasSizes ? sizes : []));
                fd.append("options", JSON.stringify(options));
                try {
                  const res = await createProduct(fd);
                  if(res?.success) {
                    setIsOpen(false);
                    setHasSizes(false);
                    setSizes([]);
                    setOptions([]);
                  } else {
                    alert(res?.error || "حدث خطأ ما");
                  }
                } finally {
                  setLoading(false);
                }
              }} className="grid grid-cols-2 gap-4 text-right"
            >
              
              {/* اختيار القسم */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">القسم الرئيسي</label>
                <select name="category_id" required className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 bg-white">
                  <option value="">اختر القسم...</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name_ar}</option>
                  ))}
                </select>
              </div>

              {/* اسم المنتج */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج</label>
                <input name="name_ar" placeholder="مثلاً: كابتشينو" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
              </div>

              {/* وصف المنتج */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">وصف المنتج</label>
                <textarea 
                  name="description_ar" 
                  placeholder="اكتب وصفاً مختصراً..." 
                  rows={2}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none text-sm"
                />
              </div>

              {/* السعر الأساسي */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">السعر الأساسي (ر.س)</label>
                <input name="price" type="number" step="0.01" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
              </div>

              {/* السعرات */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">السعرات (اختياري)</label>
                <input name="calories" type="number" placeholder="مثلاً: 180" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
              </div>

              {/* ترتيب الظهور */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">ترتيب الظهور (اختياري)</label>
                <input name="sort_order" type="number" placeholder="مثلاً: 1, 2, 3..." className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
              </div>

              {/* صورة المنتج */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">صورة المنتج</label>
                <input name="image" type="file" accept="image/*" className="w-full p-2 border rounded-lg text-sm cursor-pointer bg-white" />
              </div>

              {/* خيار تفعيل/تعطيل ميزة الأحجام */}
              <div className="col-span-2 bg-purple-50/50 p-4 rounded-xl border border-purple-100 mt-2">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="block font-bold text-sm text-purple-900">تفعيل خيارات الأحجام (صغير/وسط/كبير)</span>
                    <span className="block text-xs text-gray-500">اجعل للمنتج أحجاماً بأسعار مختلفة</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={hasSizes} 
                      onChange={(e) => setHasSizes(e.target.checked)} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {hasSizes && (
                  <div className="space-y-2 mt-3 pt-3 border-t border-purple-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-gray-700">قائمة الأحجام:</span>
                      <button 
                        type="button" 
                        onClick={addSize}
                        className="text-xs bg-purple-600 text-white px-2.5 py-1 rounded-md font-bold hover:bg-purple-700 transition-colors"
                      >
                        + إضافة حجم
                      </button>
                    </div>
                    {sizes.map((s, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input 
                          placeholder="اسم الحجم (مثلاً: كبير)" 
                          value={s.name}
                          onChange={(e) => updateSize(index, "name", e.target.value)}
                          className="flex-1 p-2 border rounded-lg text-sm bg-white outline-none"
                        />
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="السعر" 
                          value={s.price || ""}
                          onChange={(e) => updateSize(index, "price", e.target.value)}
                          className="w-24 p-2 border rounded-lg text-sm bg-white outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={() => removeSize(index)}
                          className="text-red-400 hover:text-red-600 p-1 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {sizes.length === 0 && (
                      <p className="text-xs text-purple-400 text-center py-1">اضغط على زر إضافة حجم لبدء إدخال الأحجام</p>
                    )}
                  </div>
                )}
              </div>

              {/* قسم الإضافات الاختيارية */}
              <div className="col-span-2 border-t pt-4 mt-2">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-bold text-gray-700">الإضافات والنكهات الاختيارية</label>
                  <button 
                    type="button" 
                    onClick={addOption}
                    className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-bold hover:bg-blue-100 transition-colors"
                  >
                    + إضافة خيار
                  </button>
                </div>

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {options.map((opt, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input 
                        placeholder="اسم الإضافة (مثلاً: حليب لوز)" 
                        value={opt.name}
                        onChange={(e) => updateOption(index, "name", e.target.value)}
                        className="flex-1 p-2 border rounded-lg text-sm focus:border-blue-400 outline-none"
                      />
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="السعر" 
                        value={opt.price || ""}
                        onChange={(e) => updateOption(index, "price", e.target.value)}
                        className="w-24 p-2 border rounded-lg text-sm focus:border-blue-400 outline-none"
                      />
                      <button 
                        type="button" 
                        onClick={() => removeOption(index)}
                        className="text-red-400 hover:text-red-600 p-1 font-bold text-base"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {options.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-1 italic">لا توجد إضافات لهذا المنتج</p>
                  )}
                </div>
              </div>

              {/* حالة المنتج عند الإنشاء */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">حالة المنتج</label>
                <select name="is_available" defaultValue="true" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white outline-none">
                  <option value="true">متوفر</option>
                  <option value="false">نفذت (غير متوفر)</option>
                </select>
              </div>

              {/* أزرار الحفظ والإلغاء */}
              <div className="col-span-2 flex gap-3 mt-6 border-t pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`flex-1 text-white py-2.5 rounded-xl font-bold text-sm transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 cursor-pointer'}`}
                >
                  {loading ? "جاري الحفظ..." : "حفظ المنتج"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)} 
                  className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl hover:bg-gray-200 transition-all cursor-pointer font-bold text-sm"
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