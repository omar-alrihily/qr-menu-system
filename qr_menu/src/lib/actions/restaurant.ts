"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { Restaurant } from "@/models/Restaurant";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function updateRestaurantSettings(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "غير مصرح لك" };

  try {
    await dbConnect();
    const restaurantId = session.user.id;

    // 1. معالجة اللوجو الجديد إذا وجد
    const file = formData.get("logo") as File;
    let logoUrl = formData.get("currentLogo") as string;

    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "restaurant_logos", resource_type: "image" },
          (error, result) => { if (error) reject(error); else resolve(result); }
        ).end(buffer);
      });
      logoUrl = uploadResponse.secure_url;
    }

    // 2. تحديث البيانات في قاعدة البيانات
    await Restaurant.findByIdAndUpdate(restaurantId, {
      name: formData.get("name"),
      whatsapp: formData.get("whatsapp"),
      slug: (formData.get("slug") as string).toLowerCase().replace(/\s+/g, '-'),
      logo: logoUrl,
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error: any) {
    if (error.code === 11000) return { error: "هذا الرابط (Slug) مستخدم بالفعل، اختر اسماً آخر" };
    return { error: "حدث خطأ أثناء التحديث" };
  }
}