import mongoose, { Schema, model, models } from 'mongoose';

const RestaurantSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  logo: { type: String, default: '' },
  
  // الحقول الجديدة للتخصيص
  cover_image: { type: String, default: '' }, // صورة الغلاف للمنيو
  primary_color: { type: String, default: '#f97316' }, // اللون الأساسي (برتقالي Tailwind الافتراضي)
  bg_color: { type: String, default: '#F8F9FA' }, // لون خلفية الصفحة
  
  whatsapp: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  qr_code: {
    type: String, 
    required: false
  }
}, { timestamps: true });

export const Restaurant = models.Restaurant || model('Restaurant', RestaurantSchema);