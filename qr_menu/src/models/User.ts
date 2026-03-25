import mongoose, { Schema, Document, model, models } from 'mongoose';

// تعريف واجهة البيانات لـ TypeScript
export interface IUser extends Document {
  name: string;
  email: string;
  city: string;
  category: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: [true, 'الاسم مطلوب'] },
  email: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  category: { type: String, required: true },
}, { timestamps: true });

// تصدير النموذج (مع التأكد من عدم تكراره في Next.js)
export const User = models.User || model<IUser>('User', UserSchema);