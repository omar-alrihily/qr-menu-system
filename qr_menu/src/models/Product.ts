import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  restaurant_id: { type: String, required: true, index: true },
  category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  name_ar: { type: String, required: true },
  name_en: { type: String, required: true },
  description_ar: { type: String },
  description_en: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  // الحقول الجديدة هنا
  calories: { type: Number, default: 0 },
  allergens: { type: [String], default: [] }, 
  
  is_available: { type: Boolean, default: true },
  sort_order: { type: Number, default: 0 },
}, { timestamps: true });

export const Product = models.Product || model('Product', ProductSchema);