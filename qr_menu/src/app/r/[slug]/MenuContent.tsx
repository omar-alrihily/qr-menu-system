"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Minus, ShoppingBag, X, Trash2, ChevronLeft } from "lucide-react";

export default function MenuContent({ categories, products, restaurant }: any) {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // استرجاع السلة من التخزين المحلي
  useEffect(() => {
    const savedCart = localStorage.getItem(`cart_${restaurant.slug}`);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart restoration failed", e);
      }
    }
  }, [restaurant.slug]);

  useEffect(() => {
    localStorage.setItem(`cart_${restaurant.slug}`, JSON.stringify(cart));
  }, [cart, restaurant.slug]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === productId ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const sendWhatsAppOrder = () => {
    const orderText = cart
      .map((item) => `• *${item.name_ar}* (العدد: ${item.qty})`)
      .join("\n");
    const total = cartTotal.toFixed(2);
    const message = encodeURIComponent(
      `مرحباً ${restaurant.name}، أرغب في طلب:\n\n${orderText}\n\n*إجمالي الطلب: ${total} ر.س*`
    );
    window.open(`https://wa.me/${restaurant.whatsapp}?text=${message}`, "_blank");
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      <div className="space-y-12 pb-40">
        {categories.map((cat: any) => {
          const catProducts = products.filter((p: any) => p.category_id === cat._id);
          if (catProducts.length === 0) return null;

          return (
            <section key={cat._id} id={`cat-${cat._id}`} className="scroll-mt-32 animate-in fade-in duration-700">
              <div className="flex items-center gap-4 mb-6">
                {/* استخدام اللون الأساسي في علامة القسم */}
                <div style={{ backgroundColor: 'var(--primary-color)' }} className="w-1.5 h-6 rounded-full" />
                <h2 className="text-xl font-black text-gray-900 tracking-tight">{cat.name_ar}</h2>
                <div className="flex-1 h-[1px] bg-gradient-to-l from-gray-100 to-transparent" />
              </div>

              <div className="grid gap-5">
                {catProducts.map((product: any) => {
                  const cartItem = cart.find((item) => item._id === product._id);
                  return (
                    <div 
                      key={product._id} 
                      className="group relative bg-white rounded-[2rem] p-4 flex gap-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 active:scale-[0.98]"
                    >
                      <div className="flex-1 flex flex-col justify-between py-1 pr-1">
                        <div>
                          <h3 className="font-black text-gray-900 text-lg mb-1 leading-tight transition-colors group-hover:opacity-80">
                            {product.name_ar}
                          </h3>
                          <p className="text-[12px] text-gray-400 leading-relaxed line-clamp-2 italic">
                            {product.description_ar || "وصف شهي لهذا الطبق المجهز بكل حب ليرضي ذائقتكم."}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase">السعر</span>
                            <span className="text-xl font-black text-gray-900">
                              {product.price} <small style={{ color: 'var(--primary-color)' }} className="text-[11px] font-bold mr-0.5">ر.س</small>
                            </span>
                          </div>
                          
                          {cartItem ? (
                            <div className="flex items-center gap-3 bg-gray-900 rounded-2xl p-1.5 shadow-lg animate-in zoom-in-90 duration-300">
                              <button 
                                onClick={(e) => { e.preventDefault(); removeFromCart(product._id); }} 
                                className="w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-xl hover:bg-red-500 transition-colors"
                              >
                                {cartItem.qty === 1 ? <Trash2 size={14} /> : <Minus size={16} strokeWidth={3} />}
                              </button>
                              <span className="font-black text-white min-w-[20px] text-center text-sm">{cartItem.qty}</span>
                              <button 
                                onClick={(e) => { e.preventDefault(); addToCart(product); }} 
                                style={{ backgroundColor: 'var(--primary-color)' }}
                                className="w-8 h-8 flex items-center justify-center text-white rounded-xl hover:opacity-90 transition-colors shadow-inner"
                              >
                                <Plus size={16} strokeWidth={3} />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => addToCart(product)}
                              className="h-12 px-6 bg-gray-50 text-gray-900 rounded-2xl flex items-center justify-center font-black text-sm gap-2 hover:bg-gray-100 transition-all shadow-sm border border-gray-100"
                            >
                              إضافة
                              <Plus size={16} style={{ color: 'var(--primary-color)' }} strokeWidth={3} />
                            </button>
                          )}
                        </div>
                      </div>

                      {product.image && (
                        <div className="relative w-32 h-32 shrink-0 rounded-[1.5rem] overflow-hidden shadow-md group-hover:rotate-2 transition-transform duration-500 border-2 border-white">
                          <Image src={product.image} alt={product.name_ar} fill className="object-cover" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* --- Floating Action Button (السلة) --- */}
      {cartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-10 left-0 right-0 flex justify-center px-6 z-50 animate-in fade-in slide-in-from-bottom-10">
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="w-full max-w-md bg-gray-900 text-white flex items-center justify-between p-3 pr-8 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] hover:scale-[1.03] active:scale-95 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div style={{ backgroundColor: 'var(--primary-color)' }} className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                  <ShoppingBag size={22} strokeWidth={2.5} />
                </div>
                <span className="absolute -top-2 -right-2 bg-white text-gray-900 text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-black border-2 border-gray-900">
                  {cartCount}
                </span>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">إتمام الطلب</p>
                <p className="text-lg font-black">{cartTotal.toFixed(2)} ر.س</p>
              </div>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl ml-2">
               <ChevronLeft size={20} style={{ color: 'var(--primary-color)' }} />
            </div>
          </button>
        </div>
      )}

      {/* --- Cart Drawer --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />
          <div className="relative bg-[#F8F9FA] rounded-t-[3rem] p-8 w-full max-w-2xl mx-auto max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 rounded-full" />
            <div className="flex items-center justify-between mb-8 mt-2">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <ShoppingBag style={{ color: 'var(--primary-color)' }} />
                سلة المشتريات
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm border border-gray-100">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 px-1 scrollbar-hide">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center gap-4 p-4 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm">
                  {item.image && (
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.name_ar} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-black text-gray-900 text-sm mb-1">{item.name_ar}</h4>
                    <p style={{ color: 'var(--primary-color)' }} className="font-black text-sm">{item.price} ر.س</p>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
                    <button onClick={() => removeFromCart(item._id)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500">
                      {item.qty === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
                    </button>
                    <span className="font-black text-sm w-4 text-center">{item.qty}</span>
                    <button onClick={() => addToCart(item)} style={{ color: 'var(--primary-color)' }} className="w-8 h-8 flex items-center justify-center">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 bg-white -mx-8 px-8 pb-4 border-t border-gray-100">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1 tracking-tighter">إجمالي المبلغ</p>
                  <p className="text-4xl font-black text-gray-900">
                    {cartTotal.toFixed(2)} 
                    <span style={{ color: 'var(--primary-color)' }} className="text-sm font-bold mr-2">ر.س</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={sendWhatsAppOrder}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-green-100 transition-all flex items-center justify-center gap-3 group"
              >
                تأكيد الطلب عبر واتساب
                <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}