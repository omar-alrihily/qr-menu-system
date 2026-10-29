"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Minus, ShoppingBag, X, Truck, Store, Utensils, Check, ChevronRight } from "lucide-react";

const tint = (pct: number) =>
  `color-mix(in srgb, var(--primary-color) ${pct}%, transparent)`;

const inputClass =
  "w-full px-4 py-3.5 rounded-2xl border border-black/10 bg-white text-sm outline-none transition-colors focus:border-[var(--primary-color)] focus-visible:ring-2 focus-visible:ring-[var(--primary-color)]/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span style={{ color: "var(--text-sub)" }} className="block text-[11px] font-bold mb-1.5 px-1">
        {label}
      </span>
      {children}
    </label>
  );
}

function Price({ value, className = "" }: { value: number | string; className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-1 whitespace-nowrap ${className}`}>
      <span>{value}</span>
      <span className="text-[0.65em] font-bold opacity-80">ر.س</span>
    </span>
  );
}

export default function CafeMenuContent({ categories, products, restaurant }: any) {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const [selectedSize, setSelectedSize] = useState<any>(null);
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

  const openProductModal = (product: any) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes?.length > 0 ? product.sizes[0] : null);
    setSelectedOptions([]);
    setModalQty(1);
  };

  const addToCart = (product: any, chosenSize: any = null, chosenOptions: any[] = [], quantity: number = 1) => {
    setCart((prev) => {
      const sizeName = chosenSize ? chosenSize.name : "";
      const optionIds = chosenOptions.map(o => o.name).sort().join(",");
      const uniqueId = `${product._id}-${sizeName}-${optionIds}`;
      const existing = prev.find((item) => item.uniqueId === uniqueId);

      const basePrice = chosenSize ? Number(chosenSize.price) : Number(product.price);
      const optionsTotal = chosenOptions.reduce((sum, opt) => sum + Number(opt.price), 0);
      const finalPrice = basePrice + optionsTotal;

      if (existing) {
        return prev.map((item) =>
          item.uniqueId === uniqueId ? { ...item, qty: item.qty + quantity } : item
        );
      }
      return [...prev, { ...product, uniqueId, chosenSize, chosenOptions, finalPrice, qty: quantity }];
    });
  };

  const incrementInCart = (uniqueId: string) => {
    setCart((prev) =>
      prev.map((item) => (item.uniqueId === uniqueId ? { ...item, qty: item.qty + 1 } : item))
    );
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
    setSelectedSize(null);
    setSelectedOptions([]);
    setModalQty(1);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.finalPrice * item.qty), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const basePriceInModal = selectedSize 
    ? Number(selectedSize.price) 
    : (selectedProduct ? Number(selectedProduct.price) : 0);

  const modalUnitPrice = basePriceInModal + selectedOptions.reduce((s, o) => s + Number(o.price), 0);

  const sendWhatsAppOrder = () => {
    const orderText = cart.map((item) => {
      const sizeText = item.chosenSize ? ` [الحجم: ${item.chosenSize.name}]` : "";
      const opts = item.chosenOptions?.length > 0 ? ` (إضافات: ${item.chosenOptions.map((o:any)=>o.name).join(', ')})` : "";
      return `• *${item.name_ar}*${sizeText}${opts} (العدد: ${item.qty})`;
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

  const stepTitles: Record<number, string> = {
    1: "سلتك",
    2: "كيف تريد الاستلام؟",
    3: "بيانات الطلب",
  };

  return (
    <div className="font-[tajawal] pb-40 space-y-14">
      {categories.map((cat: any) => {
        const catProducts = products
          .filter((p: any) => p.category_id?._id?.toString() === cat._id.toString() || p.category_id?.toString() === cat._id.toString())
          .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

        if (catProducts.length === 0) return null;

        return (
          <section key={cat._id} id={`cat-${cat._id}`} className="scroll-mt-28">
            <div className="flex items-baseline justify-between gap-3 mb-2 px-1">
              <h2 style={{ color: "var(--text-main)" }} className="text-2xl font-black leading-tight">
                {cat.name_ar}
              </h2>
              <span style={{ color: "var(--text-sub)" }} className="text-xs font-medium opacity-70 shrink-0">
                {catProducts.length} صنف
              </span>
            </div>
            <div style={{ backgroundColor: "var(--primary-color)" }} className="h-0.5 w-10 rounded-full mb-2" />

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10">
              {catProducts.map((product: any) => {
                const productQtyInCart = cart
                  .filter((item) => item._id === product._id)
                  .reduce((total, item) => total + item.qty, 0);
                const inCart = productQtyInCart > 0;

                const hasCustomizations = (product.sizes?.length > 0) || (product.options?.length > 0);

                const handleQuickAdd = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  hasCustomizations ? openProductModal(product) : addToCart(product);
                };

                return (
                  <article
                    key={product._id}
                    onClick={() => openProductModal(product)}
                    className="group flex items-stretch gap-4 py-5 border-b border-black/10 cursor-pointer"
                  >
                    <div className="flex-1 min-w-0 flex flex-col">
                      <h3 style={{ color: "var(--text-main)" }} className="font-extrabold text-base leading-snug">
                        {product.name_ar}
                      </h3>

                      {product.description_ar && (
                        <p style={{ color: "var(--text-sub)" }} className="text-xs leading-relaxed opacity-80 line-clamp-2 mt-1">
                          {product.description_ar}
                        </p>
                      )}

                      <div className="mt-auto pt-3 flex items-center gap-3">
                        <Price value={product.price} className="font-black text-base text-[color:var(--primary-color)]" />
                        {product.sizes?.length > 0 && (
                          <span className="text-[10px] text-gray-400 font-bold">يبدأ من</span>
                        )}
                        {product.calories > 0 && (
                          <span style={{ color: "var(--text-sub)" }} className="text-[11px] opacity-60">
                            {product.calories} سعرة
                          </span>
                        )}
                      </div>
                    </div>

                    {product.image ? (
                      <div className="relative shrink-0 w-28 h-28 sm:w-32 sm:h-32">
                        <div className="relative w-full h-full rounded-3xl overflow-hidden bg-black/5">
                          <Image
                            src={product.image}
                            alt={product.name_ar}
                            fill
                            sizes="128px"
                            className="object-cover"
                          />
                        </div>
                        <button
                          onClick={handleQuickAdd}
                          aria-label={`أضف ${product.name_ar}`}
                          style={
                            inCart
                              ? { backgroundColor: "var(--primary-color)", color: "#fff" }
                              : { backgroundColor: "#fff", color: "var(--primary-color)" }
                          }
                          className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-9 min-w-[2.25rem] px-3 rounded-full flex items-center justify-center shadow-md border border-black/5 active:scale-95 transition-transform"
                        >
                          {inCart ? (
                            <span className="text-sm font-black">{productQtyInCart}</span>
                          ) : (
                            <Plus size={18} strokeWidth={2.5} />
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="shrink-0 flex items-end">
                        <button
                          onClick={handleQuickAdd}
                          aria-label={`أضف ${product.name_ar}`}
                          style={
                            inCart
                              ? { backgroundColor: "var(--primary-color)", color: "#fff" }
                              : { backgroundColor: tint(12), color: "var(--primary-color)" }
                          }
                          className="h-10 min-w-[2.5rem] px-3 rounded-full flex items-center justify-center active:scale-95 transition-transform"
                        >
                          {inCart ? (
                            <span className="text-sm font-black">{productQtyInCart}</span>
                          ) : (
                            <Plus size={18} strokeWidth={2.5} />
                          )}
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* تفاصيل المنتج (Bottom Sheet) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200"
            onClick={closeModal}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selectedProduct.name_ar}
            style={{ backgroundColor: "var(--bg-color)" }}
            className="relative w-full sm:max-w-md max-h-[92vh] flex flex-col rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300"
          >
            <button
              onClick={closeModal}
              aria-label="إغلاق"
              className="absolute top-3 left-3 z-20 w-10 h-10 bg-white/95 rounded-full flex items-center justify-center text-gray-800 shadow cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="overflow-y-auto flex-1">
              {selectedProduct.image && (
                <div className="relative w-full aspect-[4/3] bg-black/5">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name_ar}
                    fill
                    sizes="(max-width: 640px) 100vw, 448px"
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-6 space-y-5">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h2 style={{ color: "var(--text-main)" }} className="text-2xl font-black leading-tight">
                      {selectedProduct.name_ar}
                    </h2>
                    <Price value={modalUnitPrice} className="text-xl font-black text-[color:var(--primary-color)] shrink-0 pt-1" />
                  </div>
                  {selectedProduct.description_ar && (
                    <p style={{ color: "var(--text-sub)" }} className="text-sm leading-relaxed opacity-90 mt-3">
                      {selectedProduct.description_ar}
                    </p>
                  )}
                </div>

                {/* اختيار الأحجام (يظهر فقط إذا كان المنتج يمتلك أحجام مفعلة) */}
                {selectedProduct.sizes?.length > 0 && (
                  <div>
                    <h4 style={{ color: "var(--text-main)" }} className="text-sm font-extrabold mb-3">
                      اختر الحجم <span className="text-red-500">*</span>
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedProduct.sizes.map((s: any, idx: number) => {
                        const isSelected = selectedSize?.name === s.name;
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedSize(s)}
                            className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                              isSelected 
                                ? "border-[var(--primary-color)] bg-[var(--primary-color)]/10 font-bold" 
                                : "border-black/10 bg-white"
                            }`}
                          >
                            <span style={{ color: "var(--text-main)" }} className="text-sm font-bold">
                              {s.name}
                            </span>
                            <Price value={s.price} className="text-xs font-black text-[color:var(--primary-color)]" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* اختيار الإضافات (إذا وجدت) */}
                {selectedProduct.options?.length > 0 && (
                  <div>
                    <h4 style={{ color: "var(--text-main)" }} className="text-sm font-extrabold mb-3">
                      الإضافات <span style={{ color: "var(--text-sub)" }} className="font-medium opacity-60 text-xs">(اختياري)</span>
                    </h4>
                    <div className="rounded-3xl border border-black/10 overflow-hidden divide-y divide-black/10 bg-white/60">
                      {selectedProduct.options.map((opt: any, idx: number) => {
                        const isSelected = !!selectedOptions.find(o => o.name === opt.name);
                        return (
                          <button
                            key={idx}
                            onClick={() => toggleOption(opt)}
                            style={isSelected ? { backgroundColor: tint(8) } : undefined}
                            className="w-full flex items-center gap-3 px-4 py-3.5 text-right transition-colors cursor-pointer"
                          >
                            <span
                              style={
                                isSelected
                                  ? { backgroundColor: "var(--primary-color)", borderColor: "var(--primary-color)" }
                                  : undefined
                              }
                              className="w-5 h-5 rounded-md border-2 border-black/20 flex items-center justify-center shrink-0 transition-colors"
                            >
                              {isSelected && <Check size={13} strokeWidth={3.5} className="text-white" />}
                            </span>
                            <span style={{ color: "var(--text-main)" }} className="flex-1 text-sm font-bold">
                              {opt.name}
                            </span>
                            <span style={{ color: "var(--primary-color)" }} className="text-xs font-bold whitespace-nowrap">
                              +{opt.price} ر.س
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* شريط الإضافة للطلب */}
            <div
              style={{ backgroundColor: "var(--bg-color)" }}
              className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-black/10 flex items-center gap-3"
            >
              <div className="flex items-center rounded-full border border-black/15 bg-white">
                <button
                  onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                  className="w-11 h-11 flex items-center justify-center text-gray-700 active:scale-90 transition-transform cursor-pointer"
                >
                  <Minus size={16} />
                </button>
                <span className="w-7 text-center font-black text-base">{modalQty}</span>
                <button
                  onClick={() => setModalQty(modalQty + 1)}
                  style={{ color: "var(--primary-color)" }}
                  className="w-11 h-11 flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={() => { addToCart(selectedProduct, selectedSize, selectedOptions, modalQty); closeModal(); }}
                style={{ backgroundColor: "var(--primary-color)" }}
                className="flex-1 h-12 rounded-full text-white font-black text-sm flex items-center justify-between px-5 shadow-lg active:scale-[0.98] transition-transform cursor-pointer"
              >
                <span>أضف للطلب</span>
                <span>{(modalUnitPrice * modalQty).toFixed(2)} ر.س</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* زر السلة العائم */}
      {cartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] z-50 pointer-events-none">
          <button
            onClick={() => { setIsCartOpen(true); setOrderStep(1); }}
            style={{ backgroundColor: "var(--primary-color)" }}
            className="pointer-events-auto w-full max-w-md h-14 text-white flex items-center justify-between pl-5 pr-2 rounded-full shadow-2xl active:scale-[0.98] transition-transform cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <span className="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <ShoppingBag size={19} />
                <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 rounded-full bg-white text-[11px] font-black flex items-center justify-center" style={{ color: "var(--primary-color)" }}>
                  {cartCount}
                </span>
              </span>
              <span className="font-bold text-sm">عرض السلة</span>
            </span>
            <span className="font-black text-base">{cartTotal.toFixed(2)} ر.س</span>
          </button>
        </div>
      )}

      {/* درج السلة */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200"
            onClick={() => setIsCartOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            style={{ backgroundColor: "var(--bg-color)" }}
            className="relative w-full max-w-2xl mx-auto max-h-[92vh] flex flex-col rounded-t-[2rem] shadow-2xl animate-in slide-in-from-bottom duration-300"
          >
            <div className="px-6 pt-4 pb-3">
              <div className="flex gap-1.5 mb-4" aria-hidden>
                {[1, 2, 3].map((s) => (
                  <span
                    key={s}
                    style={{ backgroundColor: s <= orderStep ? "var(--primary-color)" : undefined }}
                    className={`h-1 flex-1 rounded-full transition-colors ${s <= orderStep ? "" : "bg-black/10"}`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <h2 style={{ color: "var(--text-main)" }} className="text-xl font-black">
                  {stepTitles[orderStep]}
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-9 h-9 bg-black/5 rounded-full flex items-center justify-center text-gray-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-4">
              {orderStep === 1 && (
                cart.length === 0 ? (
                  <div className="py-16 text-center">
                    <p style={{ color: "var(--text-main)" }} className="font-bold">السلة فارغة</p>
                    <p style={{ color: "var(--text-sub)" }} className="text-sm opacity-70 mt-1">اختر من القائمة لتبدأ طلبك</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-black/10">
                    {cart.map((item) => (
                      <li key={item.uniqueId} className="flex items-center gap-3 py-4">
                        {item.image && (
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-black/5 shrink-0">
                            <Image src={item.image} alt={item.name_ar} fill sizes="56px" className="object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 style={{ color: "var(--text-main)" }} className="font-bold text-sm leading-snug">
                            {item.name_ar}
                          </h4>
                          {item.chosenSize && (
                            <span className="inline-block text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-bold mt-1 ml-1">
                              الحجم: {item.chosenSize.name}
                            </span>
                          )}
                          {item.chosenOptions?.length > 0 && (
                            <p style={{ color: "var(--text-sub)" }} className="text-[11px] opacity-70 mt-0.5 leading-snug">
                              {item.chosenOptions.map((o: any) => o.name).join("، ")}
                            </p>
                          )}
                          <Price value={(item.finalPrice * item.qty).toFixed(2)} className="text-sm font-black text-[color:var(--primary-color)] mt-1 block" />
                        </div>
                        <div className="flex items-center rounded-full border border-black/15 bg-white shrink-0">
                          <button
                            onClick={() => removeFromCart(item.uniqueId)}
                            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-red-500 cursor-pointer"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-5 text-center font-black text-sm">{item.qty}</span>
                          <button
                            onClick={() => incrementInCart(item.uniqueId)}
                            style={{ color: "var(--primary-color)" }}
                            className="w-9 h-9 flex items-center justify-center cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              )}

              {orderStep === 2 && (
                <div className="grid gap-3 pt-1">
                  {[
                    { id: "delivery", label: "توصيل للمنزل", hint: "يصلك الطلب إلى عنوانك", icon: <Truck size={22} /> },
                    { id: "pickup", label: "استلام من الفرع", hint: "تستلم طلبك بنفسك", icon: <Store size={22} /> },
                    { id: "dine_in", label: "أكل في المطعم", hint: "نخدمك على طاولتك", icon: <Utensils size={22} /> },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => { setDeliveryType(type.id); setOrderStep(3); }}
                      className="p-4 rounded-3xl border border-black/10 bg-white flex items-center gap-4 text-right hover:border-[var(--primary-color)] cursor-pointer transition"
                    >
                      <span
                        style={{ color: "var(--primary-color)", backgroundColor: tint(12) }}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                      >
                        {type.icon}
                      </span>
                      <span className="flex-1">
                        <span className="block font-extrabold text-sm text-gray-900">{type.label}</span>
                        <span className="block text-xs text-gray-500 mt-0.5">{type.hint}</span>
                      </span>
                      <ChevronRight size={18} className="text-gray-300 rotate-180" />
                    </button>
                  ))}
                </div>
              )}

              {orderStep === 3 && (
                <div className="space-y-4 pt-1">
                  <Field label="الاسم الكامل">
                    <input
                      type="text"
                      placeholder="اكتب اسمك"
                      className={inputClass}
                      value={customerData.name}
                      onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                    />
                  </Field>
                  {deliveryType === "delivery" && (
                    <>
                      <Field label="العنوان">
                        <input
                          type="text"
                          placeholder="الحي، الشارع، أقرب معلم"
                          className={inputClass}
                          value={customerData.address}
                          onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                        />
                      </Field>
                      <Field label="رقم الجوال">
                        <input
                          type="tel"
                          inputMode="tel"
                          placeholder="05xxxxxxxx"
                          className={inputClass}
                          value={customerData.phone}
                          onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                        />
                      </Field>
                    </>
                  )}
                  {deliveryType === "dine_in" && (
                    <Field label="رقم الطاولة">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="مثال: 7"
                        className={inputClass}
                        value={customerData.tableNumber}
                        onChange={(e) => setCustomerData({ ...customerData, tableNumber: e.target.value })}
                      />
                    </Field>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-black/10">
              <div className="flex items-center justify-between mb-3">
                <span style={{ color: "var(--text-sub)" }} className="text-sm font-medium">الإجمالي</span>
                <span style={{ color: "var(--text-main)" }} className="text-xl font-black">
                  {cartTotal.toFixed(2)} <span className="text-xs font-bold">ر.س</span>
                </span>
              </div>

              <div className="flex gap-3">
                {orderStep > 1 && (
                  <button
                    onClick={() => setOrderStep(orderStep - 1)}
                    className="h-12 px-6 rounded-full border border-black/15 bg-white text-sm font-bold text-gray-700 cursor-pointer"
                  >
                    رجوع
                  </button>
                )}
                {orderStep === 1 && (
                  <button
                    onClick={() => setOrderStep(2)}
                    disabled={cart.length === 0}
                    style={{ backgroundColor: "var(--primary-color)" }}
                    className="flex-1 h-12 rounded-full text-white font-black text-sm disabled:opacity-40 cursor-pointer"
                  >
                    متابعة الطلب
                  </button>
                )}
                {orderStep === 3 && (
                  <button
                    onClick={sendWhatsAppOrder}
                    disabled={!customerData.name}
                    className="flex-1 h-12 rounded-full bg-green-600 text-white font-black text-sm disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer transition-colors"
                  >
                    أرسل الطلب عبر واتساب
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}