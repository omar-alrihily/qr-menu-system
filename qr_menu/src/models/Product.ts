import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  restaurant_id: { type: String, required: true, index: true },
  category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  name_ar: { type: String, required: true },
  description_ar: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  calories: { type: Number, default: 0 },
  allergens: { type: [String], default: [] }, 
  is_available: { type: Boolean, default: true },
  sort_order: { type: Number, default: 0 },
  
  // حقل الأحجام الاختياري الجديد
  sizes: [{
    name: { type: String, required: true }, // اسم الحجم (مثلاً: كبير)
    price: { type: Number, required: true }  // سعر هذا الحجم
  }],

  // حقل الإضافات الاختيارية
  options: [{
    name: { type: String, required: true }, 
    price: { type: Number, default: 0 }    
  }]
}, { timestamps: true });

export const Product = models.Product || model('Product', ProductSchema);