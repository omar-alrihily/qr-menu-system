"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { Product } from "@/models/Product";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from 'cloudinary';

// إعداد Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "غير مصرح لك" };

  try {
    await dbConnect();

    // 1. معالجة ملف الصورة
    const file = formData.get("image") as File;
    let imageUrl = "";

    // التأكد من وجود ملف وأنه ليس فارغاً
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // الرفع إلى Cloudinary عبر Stream
      const uploadResponse: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { 
            folder: "restaurant_products", // اسم المجلد في حسابك
            resource_type: "image" 
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      imageUrl = uploadResponse.secure_url;
    }

    // 2. إنشاء المنتج في قاعدة البيانات
    await Product.create({
      restaurant_id: session.user.id,
      category_id: formData.get("category_id"),
      name_ar: formData.get("name_ar"),
      name_en: formData.get("name_en"),
      description_ar: formData.get("description_ar"),
      description_en: formData.get("description_en"),
      price: Number(formData.get("price")),
      sort_order: Number(formData.get("sort_order")) || 0,
      image: imageUrl, // تخزين رابط الصورة هنا
      is_available: true,
    });

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return { error: "فشل في إضافة المنتج أو رفع الصورة" };
  }
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "غير مصرح لك" };

  try {
    await dbConnect();
    // اختياري: يمكنك هنا أيضاً حذف الصورة من Cloudinary إذا رغبت
    await Product.findOneAndDelete({ _id: id, restaurant_id: session.user.id });
    
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    return { error: "فشل في حذف المنتج" };
  }
}