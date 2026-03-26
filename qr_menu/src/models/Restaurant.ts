import mongoose, { Schema, model, models } from 'mongoose';

const RestaurantSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // تأكد من تشفيرها بـ bcrypt لاحقاً
  logo: { type: String, default: '' },
  whatsapp: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  qr_code: {
  type: String, // سيخزن نص الـ Base64 الخاص بالصورة
  required: false
}
}, { timestamps: true }); // ينشئ تلقائياً createdAt و updatedAt

export const Restaurant = models.Restaurant || model('Restaurant', RestaurantSchema);