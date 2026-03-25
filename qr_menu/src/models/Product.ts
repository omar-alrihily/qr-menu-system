import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  // أضف هذا السطر وهو الأهم لربط المنتج بالمطعم/المستخدم
  restaurant_id: { 
    type: String, // أو Schema.Types.ObjectId إذا كنت تستخدمه كـ ID رسمي
    required: true,
    index: true // لتسريع عملية البحث عن منتجات مطعم معين
  },
  category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  name_ar: { type: String, required: true },
  name_en: { type: String, required: true },
  description_ar: { type: String },
  description_en: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  is_available: { type: Boolean, default: true },
  sort_order: { type: Number, default: 0 },
}, { timestamps: true });

export const Product = models.Product || model('Product', ProductSchema);