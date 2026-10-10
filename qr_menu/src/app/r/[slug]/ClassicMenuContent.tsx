"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Minus, ShoppingBag, X, Truck, Store, Utensils } from "lucide-react";

export default function ClassicMenuContent({ categories, products, restaurant }: any) {
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

  const removeFromCart = (uniqueId: string) => {
    setCart((prev) => {
      const index = prev.findIndex(item => item.uniqueId === uniqueId);
      if (index === -1) return prev;
      const newCart = [...prev];
      const item = newCart[index];
      if (item.qty > 1) {
        newCart[index] = { ...item, qty: item.qty - 1 };
      } else {
        newCart.splice(index, 1);
      }
      return newCart;
    });
  };

  const toggleOption = (option: any) => {
    setSelectedOptions(prev => 
      prev.find(o => o.name === option.name) 
        ? prev.filter(o => o.name !== option.name)
        : [...prev, option]
    );
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedOptions([]);
    setModalQty(1);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.finalPrice * item.qty), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const sendWhatsAppOrder = () => {
    const orderText = cart.map((item) => {
      const opts = item.chosenOptions?.length > 0 ? ` (إضافات: ${item.chosenOptions.map((o:any)=>o.name).join(', ')})` : "";
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

  const getAllergenLabel = (id: string) => {
    const labels: Record<string, string> = { nuts: 'مكسرات', eggs: 'بيض', milk: 'ألبان', gluten: 'جلوتين', seafood: 'مأكولات بحرية', soy: 'صويا' };
    return labels[id] || id;
  };

  return (
    <div className="font-[tajawal]">
      
      {/* تصميم المنيو الكلاسيكي بخط Tajawal وترويسات الأقسام المزخرفة */}
      <div className="space-y-16 pb-40 max-w-3xl mx-auto">
        {categories.map((cat: any) => {
          const catProducts = products.filter((p: any) => p.category_id === cat._id);
          if (catProducts.length === 0) return null;
          return (
            <section key={cat._id} id={`cat-${cat._id}`} className="scroll-mt-32">
              
              {/* ترويسة القسم الكلاسيكية المزخرفة */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-[1px] flex-1 bg-gradient-to-l from-[var(--primary-color)]/40 to-transparent" />
                <div className="text-center px-2">
                  <h2 style={{ color: 'var(--text-main)' }} className="text-2xl font-black tracking-wide">
                    {cat.name_ar}
                  </h2>
                  <div className="w-2 h-2 rotate-45 bg-[var(--primary-color)] mx-auto mt-2 opacity-80" />
                </div>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--primary-color)]/40 to-transparent" />
              </div>

              {/* قائمة العناصر بنمط التحريري المطبوع بخط Tajawal */}
              <div className="space-y-5">
                {catProducts.map((product: any) => {
                  const productQtyInCart = cart.filter((item) => item._id === product._id).reduce((total, item) => total + item.qty, 0);
                  return (
                    <div 
                      key={product._id} 
                      onClick={() => setSelectedProduct(product)}
                      style={{ backgroundColor: 'var(--card-bg)' }}
                      className="group cursor-pointer rounded-2xl p-4 sm:p-5 border border-black/5 hover:border-[var(--primary-color)]/40 transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden"
                    >
                      <div className="flex gap-4 sm:gap-6 items-start">
                        
                        {/* صورة المنتج (إن وجدت) */}
                        {product.image && (
                          <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden border border-black/5 shadow-inner">
                            <Image src={product.image} alt={product.name_ar} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        )}

                        {/* التفاصيل النصية */}
                        <div className="flex-1 min-w-0">
                          
                          {/* اسم الطبق + خط منقط + السعر */}
                          <div className="flex items-baseline justify-between gap-2 mb-1.5">
                            <h3 style={{ color: 'var(--text-main)' }} className="font-bold text-base sm:text-lg leading-snug">
                              {product.name_ar}
                            </h3>
                            <div className="flex-1 mx-2 border-b border-dotted border-gray-300 opacity-60 hidden sm:block" />
                            <span style={{ color: 'var(--primary-color)' }} className="font-black text-lg whitespace-nowrap shrink-0">
                              {product.price} <span className="text-xs font-bold">ر.س</span>
                            </span>
                          </div>

                          {/* وصف الطبق */}
                          {product.description_ar && (
                            <p style={{ color: 'var(--text-sub)' }} className="text-xs leading-relaxed opacity-85 line-clamp-2 mb-3">
                              {product.description_ar}
                            </p>
                          )}

                          {/* مسببات الحساسية والسعرات */}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {product.calories > 0 && (
                              <span className="text-[10px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-bold border border-orange-100">
                                {product.calories} سعرة
                              </span>
                            )}
                            {product.allergens?.map((allergen: string) => (
                              <span key={allergen} className="text-[9px] bg-gray-100/80 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                                {getAllergenLabel(allergen)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* زر الإضافة السريع */}
                      <div className="flex justify-end pt-3 mt-3 border-t border-gray-100/60">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            product.options?.length > 0 ? setSelectedProduct(product) : addToCart(product); 
                          }}
                          style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}
                          className="px-4 py-1.5 rounded-xl border text-xs font-bold transition-all hover:bg-[var(--primary-color)] hover:text-white active:scale-95 flex items-center gap-1.5"
                        >
                          {productQtyInCart > 0 ? (
                            <>
                              <span className="bg-[var(--primary-color)] text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold">
                                {productQtyInCart}
                              </span>
                              <span>مضاف للسلة</span>
                            </>
                          ) : (
                            <>
                              <Plus size={14} />
                              <span>إضافة</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* نافذة تفاصيل المنتج (Modal) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={closeModal} />
          <div style={{ backgroundColor: 'var(--bg-color)' }} className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-white/20">
            <button onClick={closeModal} className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-gray-800 shadow hover:scale-105 transition-transform"><X size={18}/></button>
            <div className="overflow-y-auto p-6 space-y-4">
              {selectedProduct.image && (
                <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-black/5">
                  <Image src={selectedProduct.image} alt={selectedProduct.name_ar} fill className="object-cover" />
                </div>
              )}
              <div className="flex justify-between items-start gap-2">
                <h2 style={{ color: 'var(--text-main)' }} className="text-xl font-black">{selectedProduct.name_ar}</h2>
                <span style={{ color: 'var(--primary-color)' }} className="text-xl font-black shrink-0">{selectedProduct.price} ر.س</span>
              </div>
              
              {selectedProduct.description_ar && (
                <p style={{ color: 'var(--text-sub)' }} className="text-xs leading-relaxed opacity-90">{selectedProduct.description_ar}</p>
              )}

              {/* الإضافات الاختيارية */}
              {selectedProduct.options?.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-600 mb-2">الإضافات الاختيارية:</h4>
                  {selectedProduct.options.map((opt: any, idx: number) => {
                    const isSelected = selectedOptions.find(o => o.name === opt.name);
                    return (
                      <button key={idx} onClick={() => toggleOption(opt)} className={`w-full flex justify-between items-center p-3 rounded-xl border text-xs transition-all ${isSelected ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/10 font-bold' : 'border-gray-200'}`}>
                        <span style={{ color: 'var(--text-main)' }}>{opt.name}</span>
                        <span style={{ color: 'var(--primary-color)' }}>+{opt.price} ر.س</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* عداد الكمية */}
              <div className="flex items-center justify-center gap-6 pt-4">
                <button onClick={() => setModalQty(Math.max(1, modalQty - 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center active:scale-95"><Minus size={16}/></button>
                <span className="text-lg font-bold">{modalQty}</span>
                <button onClick={() => setModalQty(modalQty + 1)} style={{ backgroundColor: 'var(--primary-color)' }} className="w-10 h-10 rounded-full text-white flex items-center justify-center active:scale-95"><Plus size={16}/></button>
              </div>

              {/* زر الإضافة النهائي */}
              <button 
                onClick={() => { addToCart(selectedProduct, selectedOptions, modalQty); closeModal(); }}
                style={{ backgroundColor: 'var(--primary-color)' }}
                className="w-full py-3.5 rounded-2xl text-white font-black text-center shadow-lg text-sm transition-all hover:brightness-105 active:scale-98 mt-2"
              >
                إضافة للطلب ({( (Number(selectedProduct.price) + selectedOptions.reduce((s,o)=>s+Number(o.price),0)) * modalQty ).toFixed(2)} ر.س)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      {cartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center px-6 z-50">
          <button onClick={() => { setIsCartOpen(true); setOrderStep(1); }} className="w-full max-w-md bg-slate-900 text-white flex items-center justify-between p-4 rounded-2xl shadow-2xl border border-white/10 active:scale-98 transition-transform">
            <div className="flex items-center gap-3">
              <ShoppingBag style={{ color: 'var(--primary-color)' }} size={20} />
              <span className="font-black text-base">{cartTotal.toFixed(2)} ر.س</span>
            </div>
            <span className="bg-white/15 px-3 py-1 rounded-full text-xs font-bold">مراجعة الطلب ({cartCount})</span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />
          <div style={{ backgroundColor: 'var(--bg-color)' }} className="relative rounded-t-3xl p-6 w-full max-w-2xl mx-auto max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-t border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ color: 'var(--text-main)' }} className="text-lg font-bold">
                {orderStep === 1 && "سلة المشتريات"}
                {orderStep === 2 && "طريقة الاستلام"}
                {orderStep === 3 && "بيانات الطلب"}
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500"><X size={18}/></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pb-4">
              {orderStep === 1 && cart.map((item) => (
                <div key={item.uniqueId} style={{ backgroundColor: 'var(--card-bg)' }} className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 shadow-sm">
                  <div>
                    <h4 style={{ color: 'var(--text-main)' }} className="font-bold text-sm">{item.name_ar}</h4>
                    {item.chosenOptions?.length > 0 && (
                      <p className="text-[10px] text-gray-400">إضافات: {item.chosenOptions.map((o:any)=>o.name).join(', ')}</p>
                    )}
                    <p style={{ color: 'var(--primary-color)' }} className="text-xs font-bold mt-0.5">{item.finalPrice} ر.س</p>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
                    <button onClick={() => removeFromCart(item.uniqueId)} className="p-1 text-gray-400 hover:text-red-500"><Minus size={14}/></button>
                    <span className="font-bold text-xs min-w-[16px] text-center">{item.qty}</span>
                    <button onClick={() => addToCart(item)} className="p-1" style={{ color: 'var(--primary-color)' }}><Plus size={14}/></button>
                  </div>
                </div>
              ))}

              {orderStep === 2 && (
                <div className="grid gap-3">
                  {[
                    { id: 'delivery', label: 'توصيل للمنزل', icon: <Truck size={18}/> },
                    { id: 'pickup', label: 'استلام من الفرع', icon: <Store size={18}/> },
                    { id: 'dine_in', label: 'أكل في المطعم', icon: <Utensils size={18}/> }
                  ].map((type) => (
                    <button key={type.id} onClick={() => { setDeliveryType(type.id); setOrderStep(3); }} className="p-4 rounded-2xl border flex items-center gap-3 bg-white shadow-sm hover:border-[var(--primary-color)] transition-colors">
                      {type.icon}
                      <span className="font-bold text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {orderStep === 3 && (
                <div className="space-y-3">
                  <input type="text" placeholder="الاسم الكامل" className="w-full p-3.5 rounded-xl border bg-white text-sm outline-none focus:border-[var(--primary-color)]" value={customerData.name} onChange={(e)=>setCustomerData({...customerData, name: e.target.value})} />
                  {deliveryType === 'delivery' && (
                    <>
                      <input type="text" placeholder="العنوان بالتفصيل" className="w-full p-3.5 rounded-xl border bg-white text-sm outline-none focus:border-[var(--primary-color)]" value={customerData.address} onChange={(e)=>setCustomerData({...customerData, address: e.target.value})} />
                      <input type="tel" placeholder="رقم الجوال" className="w-full p-3.5 rounded-xl border bg-white text-sm outline-none focus:border-[var(--primary-color)]" value={customerData.phone} onChange={(e)=>setCustomerData({...customerData, phone: e.target.value})} />
                    </>
                  )}
                  {deliveryType === 'dine_in' && (
                    <input type="text" placeholder="رقم الطاولة" className="w-full p-3.5 rounded-xl border bg-white text-sm outline-none focus:border-[var(--primary-color)]" value={customerData.tableNumber} onChange={(e)=>setCustomerData({...customerData, tableNumber: e.target.value})} />
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100">
              {orderStep === 1 && (
                <button onClick={() => setOrderStep(2)} style={{ backgroundColor: 'var(--primary-color)' }} className="w-full py-3.5 rounded-xl text-white font-bold text-sm">استكمال الطلب</button>
              )}
              {orderStep === 3 && (
                <button onClick={sendWhatsAppOrder} disabled={!customerData.name} className="w-full py-3.5 rounded-xl bg-green-600 text-white font-bold text-sm disabled:bg-gray-200 disabled:text-gray-400">تأكيد وإرسال واتساب</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}