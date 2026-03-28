import mongoose, { Schema, model, models } from 'mongoose';

const RestaurantSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  logo: { type: String, default: '' },
  
  // --- حقول التخصيص البصري المتقدمة ---
  cover_image: { type: String, default: '' }, // صورة الغلاف (Hero)
  primary_color: { type: String, default: '#f97316' }, // اللون الأساسي (الأزرار، الرموز، العملة)
  bg_color: { type: String, default: '#F8F9FA' },      // لون خلفية الصفحة بالكامل
  
  // الحقول الجديدة التي طلبتها:
  card_bg_color: { type: String, default: '#ffffff' },  // لون الصناديق (بطاقات المنتجات)
  text_primary_color: { type: String, default: '#111827' }, // لون خط العناوين (الأقسام وأسماء الأطباق)
  text_secondary_color: { type: String, default: '#6B7280' }, // لون خط الوصف (Description)
  
  whatsapp: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  qr_code: {
    type: String, 
    required: false
  }
}, { timestamps: true });

export const Restaurant = models.Restaurant || model('Restaurant', RestaurantSchema);