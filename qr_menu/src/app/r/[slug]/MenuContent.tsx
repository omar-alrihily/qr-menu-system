"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Minus, ShoppingBag, X, Trash2, ChevronLeft, Truck, Store, Utensils, MapPin, User, Hash } from "lucide-react";

export default function MenuContent({ categories, products, restaurant }: any) {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
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

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) => item._id === product._id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.map((item) => item._id === productId ? { ...item, qty: item.qty - 1 } : item).filter((item) => item.qty > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const sendWhatsAppOrder = () => {
    const orderText = cart.map((item) => `• *${item.name_ar}* (العدد: ${item.qty})`).join("\n");
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
                {/* لون عنوان القسم ديناميكي */}
                <h2 style={{ color: 'var(--text-main)' }} className="text-xl font-black">{cat.name_ar}</h2>
                <div className="flex-1 h-[1px] bg-gradient-to-l from-gray-100 to-transparent" />
              </div>
              <div className="grid gap-5">
                {catProducts.map((product: any) => {
                  const cartItem = cart.find((item) => item._id === product._id);
                  return (
                    <div 
  key={product._id} 
  style={{ backgroundColor: 'var(--card-bg)' }}
  className="group relative rounded-[2.5rem] p-3 flex gap-4 border border-gray-100/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden"
>
  {/* صورة المنتج مع تأثير زووم عند الحوم (Hover) */}
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

  <div className="flex-1 flex flex-col justify-between py-2">
    <div>
      <h3 
        style={{ color: 'var(--text-main)' }} 
        className="font-black text-[1.1rem] leading-tight mb-1.5 line-clamp-1"
      >
        {product.name_ar}
      </h3>
      <p 
        style={{ color: 'var(--text-sub)' }} 
        className="text-[11px] leading-relaxed opacity-80 line-clamp-2 leading-4"
      >
        {product.description_ar}
      </p>
    </div>

    <div className="flex items-end justify-between mt-2">
      <div className="flex flex-col">
        <span 
          style={{ color: 'var(--text-main)' }} 
          className="text-xl font-black flex items-baseline gap-1"
        >
          {product.price}
          <span style={{ color: 'var(--primary-color)' }} className="text-[10px] font-bold uppercase">ر.س</span>
        </span>
      </div>

      {cartItem ? (
        <div className="flex items-center bg-gray-900/95 backdrop-blur-sm rounded-2xl p-1 shadow-lg transform scale-105 transition-transform">
          <button 
            onClick={() => removeFromCart(product._id)} 
            className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <Minus size={14} strokeWidth={3} />
          </button>
          
          <span className="text-white font-bold px-2 min-w-[24px] text-center">{cartItem.qty}</span>
          
          <button 
            onClick={() => addToCart(product)} 
            style={{ backgroundColor: 'var(--primary-color)' }} 
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-inner active:scale-90 transition-transform"
          >
            <Plus size={14} strokeWidth={3} />
          </button>
        </div>
      ) : (
        <button 
          onClick={() => addToCart(product)} 
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

  {/* لمسة جمالية: خلفية باهتة تتحرك عند الحوم */}
  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary-color opacity-[0.03] rounded-full blur-3xl group-hover:opacity-[0.08] transition-opacity" />
</div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* --- Floating Button --- */}
      {cartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-10 left-0 right-0 flex justify-center px-6 z-50">
          <button onClick={() => { setIsCartOpen(true); setOrderStep(1); }} className="w-full max-w-md bg-gray-900 text-white flex items-center justify-between p-4 rounded-[2rem] shadow-2xl transition-transform active:scale-95">
            <div className="flex items-center gap-4">
                <ShoppingBag style={{ color: 'var(--primary-color)' }} />
                <span className="font-black text-lg">{cartTotal.toFixed(2)} ر.س</span>
            </div>
            <span className="bg-white/10 px-4 py-1 rounded-full text-xs font-bold">مراجعة الطلب</span>
          </button>
        </div>
      )}

      {/* --- Enhanced Cart Drawer --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />
          {/* خلفية السلة تتبع لون خلفية المنيو العام أو لون الصناديق حسب تفضيلك، هنا جعلناها تتبع الـ Card BG لتناسق أفضل */}
          <div style={{ backgroundColor: 'var(--bg-color)' }} className="relative rounded-t-[3rem] p-6 w-full max-w-2xl mx-auto max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom">
            
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
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item._id} style={{ backgroundColor: 'var(--card-bg)' }} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex-1">
                        <h4 style={{ color: 'var(--text-main)' }} className="font-bold text-sm">{item.name_ar}</h4>
                        <p style={{ color: 'var(--text-sub)' }} className="text-xs">{item.price} ر.س</p>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1.5">
                        <button onClick={() => removeFromCart(item._id)} className="text-gray-400 p-1"><Minus size={16}/></button>
                        <span className="font-bold text-sm">{item.qty}</span>
                        <button onClick={() => addToCart(item)} style={{ color: 'var(--primary-color)' }} className="p-1"><Plus size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ... باقي الخطوات Step 2 و Step 3 تبقى كما هي مع التأكد من استخدام المتغيرات في الأزرار ... */}
              {orderStep === 2 && (
                <div className="grid grid-cols-1 gap-4">
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
                      className="p-6 rounded-[2rem] border-2 flex items-center gap-4 transition-all shadow-sm"
                    >
                      <div className={`w-12 h-12 bg-${type.color}-50 text-${type.color}-600 rounded-2xl flex items-center justify-center`}>{type.icon}</div>
                      <div className="text-right">
                          <p style={{ color: 'var(--text-main)' }} className="font-black text-lg">{type.label}</p>
                          <p style={{ color: 'var(--text-sub)' }} className="text-xs">{type.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {orderStep === 3 && (
  <div className="space-y-4 animate-in fade-in slide-in-from-left duration-300">
    {/* حقل الاسم - يظهر دائماً */}
    <div className="relative">
      <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input 
        type="text" placeholder="الاسم الكامل" 
        style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)' }}
        className="w-full p-4 pr-12 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
        value={customerData.name} onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
      />
    </div>

    {/* حقول التوصيل - تظهر فقط إذا اختار العميل "توصيل" */}
    {deliveryType === 'delivery' && (
      <>
        <div className="relative">
          <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" placeholder="العنوان بالتفصيل (الحي، الشارع، رقم المنزل)" 
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

    {/* حقل رقم الطاولة - يظهر فقط في "أكل بالمطعم" وهو اختياري */}
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
    
    {/* ملاحظة بسيطة للعميل في حالة الاستلام من الفرع */}
    {deliveryType === 'pickup' && (
      <p className="text-center text-sm p-4 rounded-xl bg-orange-50 text-orange-600 font-medium">
        سيتم تجهيز طلبك للاستلام من الفرع باسم: {customerData.name || '...'}
      </p>
    )}
  </div>
)}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex justify-between mb-4 px-2">
                <span style={{ color: 'var(--text-sub)' }} className="font-bold">الإجمالي:</span>
                <span style={{ color: 'var(--text-main)' }} className="font-black text-xl">{cartTotal.toFixed(2)} ر.س</span>
              </div>
              
              {orderStep === 1 && (
                <button 
                  onClick={() => setOrderStep(2)}
                  style={{ backgroundColor: 'var(--primary-color)' }}
                  className="w-full text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-lg"
                >
                  استكمال الطلب <ChevronLeft size={20}/>
                </button>
              )}

              {orderStep === 3 && (
                <button 
                  onClick={sendWhatsAppOrder}
                  disabled={!customerData.name || (deliveryType === 'delivery' && !customerData.address)}
                  className="w-full bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-lg"
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