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

// دالة مساعدة لرفع الصور إلى Cloudinary
async function uploadToCloudinary(file: File) {
  if (!file || file.size === 0) return null;
  
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadResponse: any = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "restaurant_products", resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
  return uploadResponse.secure_url;
}

// 1. إضافة منتج جديد
export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "غير مصرح لك" };

  try {
    await dbConnect();

    const file = formData.get("image") as File;
    const imageUrl = await uploadToCloudinary(file);

    await Product.create({
      restaurant_id: session.user.id,
      category_id: formData.get("category_id"),
      name_ar: formData.get("name_ar"),
      name_en: formData.get("name_en"),
      description_ar: formData.get("description_ar"),
      description_en: formData.get("description_en"),
      calories: Number(formData.get("calories")) || 0,
      allergens: formData.getAll("allergens"), // لاستقبال عدة قيم من الـ Checkboxes
      price: Number(formData.get("price")),
      sort_order: Number(formData.get("sort_order")) || 0,
      image: imageUrl || "", 
      is_available: true,
    });

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error: any) {
    console.error("Create Error:", error);
    return { error: "فشل في إضافة المنتج" };
  }
}

// 2. تعديل منتج موجود
export async function updateProduct(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "غير مصرح لك" };

  try {
    await dbConnect();
    const existingProduct = await Product.findOne({ _id: id, restaurant_id: session.user.id });
    if (!existingProduct) return { error: "المنتج غير موجود" };

    let imageUrl = existingProduct.image;
    const file = formData.get("image") as File;

    // إذا تم رفع صورة جديدة، نحذف القديمة ونرفع الجديدة
    if (file && file.size > 0) {
      if (existingProduct.image) {
        const oldPublicId = existingProduct.image.split('/').pop()?.split('.')[0];
        if (oldPublicId) await cloudinary.uploader.destroy(`restaurant_products/${oldPublicId}`);
      }
      imageUrl = await uploadToCloudinary(file);
    }

    await Product.findByIdAndUpdate(id, {
      category_id: formData.get("category_id"),
      name_ar: formData.get("name_ar"),
      name_en: formData.get("name_en"),
      description_ar: formData.get("description_ar"),
      description_en: formData.get("description_en"),
      calories: Number(formData.get("calories")) || 0,
      allergens: formData.getAll("allergens"),
      price: Number(formData.get("price")),
      sort_order: Number(formData.get("sort_order")) || 0,
      image: imageUrl,
      is_available: formData.get("is_available") === "true",
    });

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Update Error:", error);
    return { error: "فشل في تحديث المنتج" };
  }
}

// 3. حذف منتج
export async function deleteProduct(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "غير مصرح لك" };

  try {
    await dbConnect();
    const product = await Product.findOne({ _id: id, restaurant_id: session.user.id });
    if (!product) return { error: "المنتج غير موجود" };

    // حذف الصورة من كلواديناري لتوفير المساحة
    if (product.image) {
      const publicId = product.image.split('/').pop()?.split('.')[0];
      if (publicId) await cloudinary.uploader.destroy(`restaurant_products/${publicId}`);
    }

    await Product.deleteOne({ _id: id });
    
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { error: "فشل في حذف المنتج" };
  }
}