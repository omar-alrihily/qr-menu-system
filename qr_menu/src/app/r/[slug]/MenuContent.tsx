"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Minus, ShoppingBag, X, Trash2, ChevronLeft, Truck, Store, Utensils, MapPin, User, Hash } from "lucide-react";

export default function MenuContent({ categories, products, restaurant }: any) {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [modalQty, setModalQty] = useState(1);


  const [orderStep, setOrderStep] = useState(1);
  const [deliveryType, setDeliveryType] = useState("");
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    address: "",
    tableNumber: "",
  });

  useEffect(() => {
    const savedCart = localStorage.getItem(`cart_${restaurant.slug}`);
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
    }
  }, [restaurant.slug]);

  useEffect(() => {
    localStorage.setItem(`cart_${restaurant.slug}`, JSON.stringify(cart));
  }, [cart, restaurant.slug]);

 // 2. تحديث دالة addToCart لتقبل الكمية
const addToCart = (product: any, chosenOptions: any[] = [], quantity: number = 1) => {
  setCart((prev) => {
    const optionIds = chosenOptions.map(o => o.name).sort().join(",");
    const uniqueId = `${product._id}-${optionIds}`;

    const existing = prev.find((item) => item.uniqueId === uniqueId);
    
    const optionsTotal = chosenOptions.reduce((sum, opt) => sum + Number(opt.price), 0);
    const finalPrice = Number(product.price) + optionsTotal;

    if (existing) {
      return prev.map((item) => 
        item.uniqueId === uniqueId ? { ...item, qty: item.qty + quantity } : item
      );
    }
    
    return [...prev, { ...product, uniqueId, chosenOptions, finalPrice, qty: quantity }];
  });
};

const removeFromCart = (uniqueId: string) => { // تغيير المعامل إلى uniqueId
  setCart((prev) => {
    // البحث عن العنصر باستخدام المعرف الفريد
    const index = prev.findIndex(item => item.uniqueId === uniqueId);
    if (index === -1) return prev;

    const newCart = [...prev];
    const item = newCart[index];

    if (item.qty > 1) {
      // تنقيص الكمية
      newCart[index] = { ...item, qty: item.qty - 1 };
    } else {
      // حذف العنصر تماماً من السلة
      newCart.splice(index, 1);
    }
    return newCart;
  });
};
// ابحث عن آخر عنصر تم إضافته لهذا المنتج تحديداً
const handleRemoveSpecificProduct = (productId: string) => {
  const itemToRemove = [...cart].reverse().find(item => item._id === productId);
  if (itemToRemove) {
    removeFromCart(itemToRemove.uniqueId);
  }
};


  // دالة التعامل مع اختيار الإضافات في المودال
const toggleOption = (option: any) => {
  setSelectedOptions(prev => 
    prev.find(o => o.name === option.name) 
      ? prev.filter(o => o.name !== option.name)
      : [...prev, option]
  );
};

// 3. تعديل زر الإغلاق ليعيد ضبط الكمية
const closeModal = () => {
  setSelectedProduct(null);
  setSelectedOptions([]);
  setModalQty(1);
};

  const cartTotal = cart.reduce((sum, item) => sum + (item.finalPrice * item.qty), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const sendWhatsAppOrder = () => {
    const orderText = cart.map((item) => {
  const opts = item.chosenOptions?.length > 0 
    ? ` (إضافات: ${item.chosenOptions.map((o:any)=>o.name).join(', ')})` 
    : "";
  return `• *${item.name_ar}*${opts} (العدد: ${item.qty})`;
}).join("\n");
    let deliveryInfo = "";
    if (deliveryType === "delivery") {
      deliveryInfo = `\n📍 *بيانات التوصيل:*\n- الاسم: ${customerData.name}\n- العنوان: ${customerData.address}\n- الجوال: ${customerData.phone}`;
    } else if (deliveryType === "pickup") {
      deliveryInfo = `\n🥡 *نوع الطلب:* استلام من الفرع\n- اسم العميل: ${customerData.name}`;
    } else {
      deliveryInfo = `\n🍽️ *نوع الطلب:* أكل في المطعم\n- رقم الطاولة: ${customerData.tableNumber}`;
    }
    const message = encodeURIComponent(`مرحباً ${restaurant.name}، طلب جديد:\n\n${orderText}\n\n*إجمالي الطلب: ${cartTotal.toFixed(2)} ر.س*${deliveryInfo}`);
    window.open(`https://wa.me/${restaurant.whatsapp}?text=${message}`, "_blank");
  };

  // مساعد لتحويل معرفات الحساسية إلى نصوص عربية
  const getAllergenLabel = (id: string) => {
    const labels: Record<string, string> = {
      nuts: 'مكسرات', eggs: 'بيض', milk: 'ألبان', 
      gluten: 'جلوتين', seafood: 'مأكولات بحرية', soy: 'صويا'
    };
    return labels[id] || id;
  };

  return (
    <>
      <div className="space-y-12 pb-40">
        {categories.map((cat: any) => {
          const catProducts = products.filter((p: any) => p.category_id === cat._id);
          if (catProducts.length === 0) return null;
          return (
            <section key={cat._id} id={`cat-${cat._id}`} className="scroll-mt-32 animate-in fade-in duration-700">
              <div className="flex items-center gap-4 mb-6">
                <div style={{ backgroundColor: 'var(--primary-color)' }} className="w-1.5 h-6 rounded-full" />
                <h2 style={{ color: 'var(--text-main)' }} className="text-xl font-black">{cat.name_ar}</h2>
                <div className="flex-1 h-[4px] bg-gradient-to-l from-gray-100 to-transparent" />
              </div>
              <div className="grid gap-5">
                {catProducts.map((product: any) => {
                 const productQtyInCart = cart
  .filter((item) => item._id === product._id)
  .reduce((total, item) => total + item.qty, 0);
                  return (
                    <div 
                      key={product._id} 
                      onClick={() => setSelectedProduct(product)}
                      style={{ backgroundColor: 'var(--card-bg)' }}
                      className="group relative rounded-[2.5rem] p-3 flex gap-4 border border-gray-100/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden"
                    >
                      {product.image && (
                        <div className="relative w-28 h-28 shrink-0 rounded-[2rem] overflow-hidden shadow-md border border-white/20">
                          <Image 
                            src={product.image} 
                            alt={product.name_ar} 
                            fill 
                            className="object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                        </div>
                      )}

                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <h3 style={{ color: 'var(--text-main)' }} className="font-black text-[1.05rem] leading-tight line-clamp-1">
                              {product.name_ar}
                            </h3>
                            {product.calories > 0 && (
                              <span className="shrink-0 text-[9px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-bold border border-orange-100">
                                {product.calories} Cal
                              </span>
                            )}
                          </div>
                          
                          <p style={{ color: 'var(--text-sub)' }} className="text-[11px] leading-relaxed opacity-80 line-clamp-2 leading-4 mb-2">
                            {product.description_ar}
                          </p>

                          {/* عرض مسببات الحساسية */}
                          {product.allergens && product.allergens.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {product.allergens.map((allergen: string) => (
                                <span key={allergen} className="text-[8px] bg-gray-100/60 text-gray-500 px-1.5 py-0.5 rounded-md border border-gray-200/50 font-medium">
                                  {getAllergenLabel(allergen)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-end justify-between mt-auto">
                          <div className="flex flex-col">
                            <span style={{ color: 'var(--text-main)' }} className="text-xl font-black flex items-baseline gap-1">
                              {product.price}
                              <span style={{ color: 'var(--primary-color)' }} className="text-[10px] font-bold uppercase">ر.س</span>
                            </span>
                          </div>

                          {productQtyInCart > 0 ? (
  <div onClick={(e) => e.stopPropagation()} className="flex items-center bg-gray-900/95 backdrop-blur-sm rounded-2xl p-1 shadow-lg transform scale-105 transition-transform">
    {/* زر الناقص: سيقوم بحذف قطعة واحدة من أول ظهور للمنتج في السلة */}
    <button 
      onClick={() => handleRemoveSpecificProduct(product._id)}
      className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-xl transition-colors"
    >
      <Minus size={14} strokeWidth={3} />
    </button>
    
    {/* يعرض إجمالي القطع من هذا الصنف في السلة */}
    <span className="text-white font-bold px-2 min-w-[24px] text-center text-sm">
      {productQtyInCart}
    </span>
    
    {/* زر الزائد: يفتح المودال لاختيار الإضافات أو تأكيد الإضافة */}
    <button 
      onClick={() => setSelectedProduct(product)} 
      style={{ backgroundColor: 'var(--primary-color)' }} 
      className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-inner active:scale-90 transition-transform"
    >
      <Plus size={14} strokeWidth={3} />
    </button>
  </div>
) : (
  <button 
    onClick={(e) => {
      e.stopPropagation();
      // إذا كان المنتج له إضافات، افتح المودال. إذا لم يكن له، أضفه مباشرة
      if (product.options && product.options.length > 0) {
        setSelectedProduct(product);
      } else {
        addToCart(product);
      }
    }}
    style={{ 
      backgroundColor: 'var(--primary-color)',
      boxShadow: `0 4px 14px 0 var(--primary-color-transparent, rgba(0,0,0,0.1))` 
    }}
    className="h-10 w-10 sm:w-auto sm:px-5 rounded-2xl flex items-center justify-center gap-2 text-white font-bold transition-all active:scale-95 hover:brightness-110"
  >
    <span className="hidden sm:block text-sm">إضافة</span>
    <Plus size={18} strokeWidth={3} />
  </button>
)}
                        </div>
                      </div>
                      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary-color opacity-[0.03] rounded-full blur-3xl group-hover:opacity-[0.08] transition-opacity" />
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* --- نافذة تفاصيل المنتج --- */}
{selectedProduct && (
  <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 transition-all duration-300">
    {/* خلفية للإغلاق عند النقر خارج النافذة */}
    <div className="absolute inset-0" onClick={() => setSelectedProduct(null)} />
    
    <div 
      style={{ backgroundColor: 'var(--bg-color)' }} 
      className="relative w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300 flex flex-col max-h-[90vh]"
    >
      {/* زر الإغلاق */}
      <button 
        onClick={() => setSelectedProduct(null)}
        className="absolute top-5 right-5 z-20 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-lg hover:scale-110 transition-transform"
      >
        <X size={20} />
      </button>

      <div className="overflow-y-auto custom-scrollbar">
        {/* صورة المنتج */}
        {selectedProduct.image && (
          <div className="relative w-full h-64 shadow-inner">
            <Image 
              src={selectedProduct.image} 
              alt={selectedProduct.name_ar} 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        <div className="p-7">
          {/* العنوان والسعر */}
          <div className="flex justify-between items-start mb-2">
            <h2 style={{ color: 'var(--text-main)' }} className="text-2xl font-black">
              {selectedProduct.name_ar}
            </h2>
            <span style={{ color: 'var(--primary-color)' }} className="text-2xl font-black">
              {selectedProduct.price} ر.س
            </span>
          </div>

          {/* السعرات */}
          {selectedProduct.calories > 0 && (
            <div className="flex items-center gap-2 mb-4 text-orange-600 bg-orange-50 w-fit px-3 py-1 rounded-full text-xs font-bold">
              <Hash size={14} /> {selectedProduct.calories} سعرة حرارية
            </div>
          )}

          {/* الوصف */}
          <p style={{ color: 'var(--text-sub)' }} className="text-base leading-relaxed mb-6">
            {selectedProduct.description_ar}
          </p>

          {/* قسم الإضافات الاختيارية (هذا الجزء الجديد) */}
         {selectedProduct.options && selectedProduct.options.length > 0 && (
  <div className="mb-6 bg-gray-50/50 p-4 rounded-3xl border border-gray-100">
    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
      <Plus size={16} className="text-green-600" /> إضافات اختيارية
    </h4>
    <div className="space-y-2">
      {selectedProduct.options.map((option: any, idx: number) => {
        const isSelected = selectedOptions.find(o => o.name === option.name);
        return (
          <button 
            key={idx} 
            onClick={() => toggleOption(option)}
            className={`w-full flex justify-between items-center p-3 rounded-2xl border transition-all ${
              isSelected ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-white'
            }`}
          >
            <span className="text-gray-700 font-medium text-sm">{option.name}</span>
            <span className="text-gray-500 text-sm font-bold">+{option.price} ر.س</span>
          </button>
        );
      })}
    </div>
  </div>
)}

          {/* مسببات الحساسية */}
          {selectedProduct.allergens?.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">مسببات الحساسية:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.allergens.map((allergen: string) => (
                  <span key={allergen} className="bg-red-50 text-red-600 px-3 py-1.5 rounded-xl text-xs font-semibold">
                    {getAllergenLabel(allergen)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>



     {/* أضف هذا الجزء قبل زر "إضافة للطلب" في أسفل المودال */}
<div className="flex items-center justify-center gap-6 mb-4">
  <button 
    onClick={() => setModalQty(Math.max(1, modalQty - 1))}
    className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-gray-500"
  >
    <Minus size={20} />
  </button>
  <span className="text-2xl font-black">{modalQty}</span>
  <button 
    onClick={() => setModalQty(modalQty + 1)}
    style={{ backgroundColor: 'var(--primary-color)' }}
    className="w-12 h-12 rounded-full flex items-center justify-center text-white"
  >
    <Plus size={20} />
  </button>
</div>

{/* تحديث زر الإضافة النهائي ليستخدم الكمية modalQty */}
<button 
  onClick={() => {
    addToCart(selectedProduct, selectedOptions, modalQty);
    closeModal();
  }}
  style={{ backgroundColor: 'var(--primary-color)' }}
  className="w-full py-4 rounded-2xl text-white font-black text-lg flex items-center justify-center gap-3"
>
  إضافة للطلب ({( (Number(selectedProduct.price) + selectedOptions.reduce((s,o)=>s+Number(o.price),0)) * modalQty ).toFixed(2)} ر.س)
</button>
    </div>
  </div>
)}

      {/* --- Floating Button --- */}
      {cartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-10 left-0 right-0 flex justify-center px-6 z-50">
          <button onClick={() => { setIsCartOpen(true); setOrderStep(1); }} className="w-full max-w-md bg-gray-900 text-white flex items-center justify-between p-4 rounded-[2rem] shadow-2xl transition-transform active:scale-95 border border-white/10">
            <div className="flex items-center gap-4">
                <ShoppingBag style={{ color: 'var(--primary-color)' }} />
                <span className="font-black text-lg">{cartTotal.toFixed(2)} ر.س</span>
            </div>
            <span className="bg-white/10 px-4 py-1 rounded-full text-xs font-bold">مراجعة الطلب ({cartCount})</span>
          </button>
        </div>
      )}

      {/* --- Cart Drawer --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/60 backdrop-blur-sm px-2 sm:px-0">
          <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />
          <div style={{ backgroundColor: 'var(--bg-color)' }} className="relative rounded-t-[3rem] p-6 w-full max-w-2xl mx-auto max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {orderStep > 1 && (
                    <button onClick={() => setOrderStep(orderStep - 1)} className="p-2 bg-white rounded-xl shadow-sm"><ChevronLeft className="rotate-180" size={20}/></button>
                )}
                <h2 style={{ color: 'var(--text-main)' }} className="text-xl font-black">
                    {orderStep === 1 && "سلة المشتريات"}
                    {orderStep === 2 && "طريقة الاستلام"}
                    {orderStep === 3 && "بيانات الطلب"}
                </h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-1 scrollbar-hide">
              {orderStep === 1 && (
                <div className="space-y-3 pb-4">
                  {cart.map((item) => (
                    <div key={item.uniqueId} style={{ backgroundColor: 'var(--card-bg)' }} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex-1">
                        <h4 style={{ color: 'var(--text-main)' }} className="font-bold text-sm">{item.name_ar}</h4>
                        {item.chosenOptions?.length > 0 && (
  <p className="text-[10px] text-gray-400 italic">
    إضافات: {item.chosenOptions.map((o:any) => o.name).join(', ')}
  </p>
)}
                        <p style={{ color: 'var(--text-sub)' }} className="text-xs">{item.price} ر.س</p>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1.5 border border-gray-100">
                        <button onClick={() => removeFromCart(item.uniqueId)} className="text-gray-400 p-1 hover:text-red-500 transition-colors"><Minus size={16}/></button>
                        <span className="font-bold text-sm min-w-[20px] text-center">{item.qty}</span>
                        <button onClick={() => addToCart(item)} style={{ color: 'var(--primary-color)' }} className="p-1 hover:scale-110 transition-transform"><Plus size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {orderStep === 2 && (
                <div className="grid grid-cols-1 gap-4 pb-4">
                  {[
                    { id: 'delivery', label: 'توصيل للمنزل', sub: 'نصل إليك أينما كنت', icon: <Truck />, color: 'blue' },
                    { id: 'pickup', label: 'استلام من المطعم', sub: 'تجهز طلبك وتستلمه', icon: <Store />, color: 'green' },
                    { id: 'dine_in', label: 'أكل في المطعم', sub: 'حدد رقم طاولتك', icon: <Utensils />, color: 'purple' }
                  ].map((type) => (
                    <button 
                      key={type.id}
                      onClick={() => { setDeliveryType(type.id); setOrderStep(3); }}
                      style={{ 
                        backgroundColor: 'var(--card-bg)',
                        borderColor: deliveryType === type.id ? 'var(--primary-color)' : 'transparent' 
                      }}
                      className="p-6 rounded-[2rem] border-2 flex items-center gap-4 transition-all shadow-sm hover:border-[var(--primary-color)]"
                    >
                      <div className={`w-12 h-12 bg-gray-50 text-gray-600 rounded-2xl flex items-center justify-center`}>{type.icon}</div>
                      <div className="text-right flex-1">
                          <p style={{ color: 'var(--text-main)' }} className="font-black text-lg">{type.label}</p>
                          <p style={{ color: 'var(--text-sub)' }} className="text-xs opacity-70">{type.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {orderStep === 3 && (
                <div className="space-y-4 pb-4 animate-in fade-in slide-in-from-left duration-300">
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" placeholder="الاسم الكامل" 
                      style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)' }}
                      className="w-full p-4 pr-12 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all"
                      value={customerData.name} onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                    />
                  </div>

                  {deliveryType === 'delivery' && (
                    <>
                      <div className="relative">
                        <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          type="text" placeholder="العنوان بالتفصيل" 
                          style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)' }}
                          className="w-full p-4 pr-12 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                          value={customerData.address} onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                        />
                      </div>
                      <div className="relative">
                        <Hash className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          type="tel" placeholder="رقم الهاتف" 
                          style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)' }}
                          className="w-full p-4 pr-12 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                          value={customerData.phone} onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                        />
                      </div>
                    </>
                  )}

                  {deliveryType === 'dine_in' && (
                    <div className="relative">
                      <Utensils className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" placeholder="رقم الطاولة (اختياري)" 
                        style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)' }}
                        className="w-full p-4 pr-12 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                        value={customerData.tableNumber} onChange={(e) => setCustomerData({...customerData, tableNumber: e.target.value})}
                      />
                    </div>
                  )}
                  
                  {deliveryType === 'pickup' && (
                    <p className="text-center text-sm p-4 rounded-2xl bg-orange-50 text-orange-600 font-medium border border-orange-100">
                      سيتم تجهيز طلبك للاستلام من الفرع باسم: {customerData.name || '...'}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 pt-6 border-t border-gray-100 bg-[var(--bg-color)]">
              <div className="flex justify-between mb-4 px-2">
                <span style={{ color: 'var(--text-sub)' }} className="font-bold">الإجمالي النهائي:</span>
                <span style={{ color: 'var(--text-main)' }} className="font-black text-2xl">{cartTotal.toFixed(2)} ر.س</span>
              </div>
              
              {orderStep === 1 && (
                <button 
                  onClick={() => setOrderStep(2)}
                  style={{ backgroundColor: 'var(--primary-color)' }}
                  className="w-full text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-2 shadow-xl hover:brightness-105 active:scale-[0.98] transition-all"
                >
                  استكمال الطلب <ChevronLeft size={20}/>
                </button>
              )}

              {orderStep === 3 && (
                <button 
                  onClick={sendWhatsAppOrder}
                  disabled={!customerData.name || (deliveryType === 'delivery' && !customerData.address)}
                  className="w-full bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-2 transition-all shadow-xl hover:bg-green-700 active:scale-[0.98]"
                >
                  تأكيد وإرسال واتساب
                  <ChevronLeft className="mr-2" size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}