import mongoose, { Schema, model, models } from 'mongoose';

const RestaurantSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // تأكد من تشفيرها بـ bcrypt لاحقاً
  logo: { type: String, default: '' },
  whatsapp: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
}, { timestamps: true }); // ينشئ تلقائياً createdAt و updatedAt

export const Restaurant = models.Restaurant || model('Restaurant', RestaurantSchema);