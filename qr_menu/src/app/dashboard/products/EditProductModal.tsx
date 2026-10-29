"use client";
import { useState } from "react";
import { updateProduct } from "@/lib/actions/product";

export default function EditProductModal({ product, categories }: { product: any, categories: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [hasSizes, setHasSizes] = useState<boolean>(product.sizes && product.sizes.length > 0);
  const [sizes, setSizes] = useState<{ name: string; price: number }[]>(product.sizes || []);
  const [options, setOptions] = useState<{ name: string; price: number }[]>(product.options || []);

  const addSize = () => setSizes([...sizes, { name: "", price: 0 }]);
  const removeSize = (index: number) => setSizes(sizes.filter((_, i) => i !== index));
  const updateSizeValue = (index: number, field: "name" | "price", value: string | number) => {
    const newSizes = [...sizes];
    if (field === "name") newSizes[index].name = value as string;
    if (field === "price") newSizes[index].price = Number(value);
    setSizes(newSizes);
  };

  const addOption = () => setOptions([...options, { name: "", price: 0 }]);
  const removeOption = (index: number) => setOptions(options.filter((_, i) => i !== index));
  const updateOptionValue = (index: number, field: "name" | "price", value: string | number) => {
    const newOptions = [...options];
    if (field === "name") newOptions[index].name = value as string;
    if (field === "price") newOptions[index].price = Number(value);
    setOptions(newOptions);
  };

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
                fd.append("sizes", JSON.stringify(hasSizes ? sizes : []));
                fd.append("options", JSON.stringify(options));
                
                try {
                  const res = await updateProduct(product._id, fd);
                  if(res?.success) {
                    setIsOpen(false);
                  } else {
                    alert(res?.error || "حدث خطأ ما");
                  }
                } finally {
                  setLoading(false);
                }
              }} className="grid grid-cols-2 gap-4 text-right"
            >
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">القسم الرئيسي</label>
                <select name="category_id" defaultValue={product.category_id} required className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name_ar}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">صورة المنتج (اتركها فارغة للإبقاء على الحالية)</label>
                <input name="image" type="file" accept="image/*" className="w-full p-2 border rounded-lg text-sm cursor-pointer bg-white" />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالعربي</label>
                <input name="name_ar" defaultValue={product.name_ar} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">ترتيب الظهور</label>
                <input name="sort_order" type="number" defaultValue={product.sort_order || 0} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">السعرات الحرارية</label>
                <input name="calories" type="number" defaultValue={product.calories || 0} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">السعر الأساسي</label>
                <input name="price" type="number" step="0.01" defaultValue={product.price} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">وصف المنتج</label>
                <textarea 
                  name="description_ar" 
                  defaultValue={product.description_ar} 
                  placeholder="اكتب وصفاً للمنتج..." 
                  rows={2}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none text-right outline-none text-sm"
                />
              </div>

              {/* قسم خيار الأحجام الاختياري في التعديل */}
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
                          placeholder="اسم الحجم" 
                          value={s.name}
                          onChange={(e) => updateSizeValue(index, "name", e.target.value)}
                          className="flex-1 p-2 border rounded-lg text-sm bg-white outline-none"
                        />
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="السعر" 
                          value={s.price}
                          onChange={(e) => updateSizeValue(index, "price", e.target.value)}
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
                      <p className="text-xs text-purple-400 text-center py-1">لا توجد أحجام مضافة</p>
                    )}
                  </div>
                )}
              </div>

              {/* قسم الإضافات */}
              <div className="col-span-2 border-t pt-4 mt-2">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-bold text-gray-700">الإضافات الاختيارية</label>
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
                        placeholder="اسم الإضافة" 
                        value={opt.name}
                        onChange={(e) => updateOptionValue(index, "name", e.target.value)}
                        className="flex-1 p-2 border rounded-lg text-sm focus:border-blue-400 outline-none"
                      />
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="السعر" 
                        value={opt.price}
                        onChange={(e) => updateOptionValue(index, "price", e.target.value)}
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
                    <p className="text-xs text-gray-400 text-center py-1">لا توجد إضافات حالياً</p>
                  )}
                </div>
              </div>

              {/* حقل الحالة (متوفر / غير متوفر) المفقود */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">حالة المنتج</label>
                <select name="is_available" defaultValue={product.is_available?.toString() ?? "true"} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none">
                  <option value="true">متوفر</option>
                  <option value="false">نفذت (غير متوفر)</option>
                </select>
              </div>

              <div className="col-span-2 flex gap-3 mt-6 border-t pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`flex-1 text-white py-2.5 rounded-xl font-bold text-sm transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'}`}
                >
                  {loading ? "جاري التحديث..." : "تحديث البيانات"}
                </button>
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors font-bold text-sm">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}