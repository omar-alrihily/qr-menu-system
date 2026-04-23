import mongoose, { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema({
  restaurant_id: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name_ar: { type: String, required: true },
  
  image: { type: String },
  sort_order: { type: Number, default: 0 },
  is_visible: { type: Boolean, default: true },
}, { timestamps: true });

export const Category = models.Category || model('Category', CategorySchema);