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

// دالة مساعدة لرفع الملفات إلى Cloudinary
async function uploadToCloudinary(file: File, folder: string) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder, resource_type: "image" },
      (error, result) => { if (error) reject(error); else resolve(result); }
    );
    stream.end(buffer);
  });
}

export async function updateRestaurantSettings(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "غير مصرح لك" };

  try {
    await dbConnect();
    const restaurantId = session.user.id;

    // 1. معالجة اللوجو (Logo)
    const logoFile = formData.get("logo") as File;
    let logoUrl = formData.get("currentLogo") as string;

    if (logoFile && logoFile.size > 0) {
      const uploadResponse: any = await uploadToCloudinary(logoFile, "restaurant_logos");
      logoUrl = uploadResponse.secure_url;
    }

    // 2. معالجة صورة الغلاف (Cover Image)
    const coverFile = formData.get("cover_image") as File;
    let coverUrl = formData.get("currentCover") as string;

    if (coverFile && coverFile.size > 0) {
      const uploadResponse: any = await uploadToCloudinary(coverFile, "restaurant_covers");
      coverUrl = uploadResponse.secure_url;
    }

    // 3. استخراج كافة الألوان من الـ FormData (بما فيها الحقول الجديدة)
    const primary_color = formData.get("primary_color") as string;
    const bg_color = formData.get("bg_color") as string;
    const card_bg_color = formData.get("card_bg_color") as string;
    const text_primary_color = formData.get("text_primary_color") as string;
    const text_secondary_color = formData.get("text_secondary_color") as string;

    const slug = (formData.get("slug") as string).toLowerCase().replace(/\s+/g, '-');

    // 4. تحديث البيانات في قاعدة البيانات
    await Restaurant.findByIdAndUpdate(restaurantId, {
      name: formData.get("name"),
      whatsapp: formData.get("whatsapp"),
      slug: slug,
      logo: logoUrl,
      cover_image: coverUrl,
      primary_color: primary_color,
      bg_color: bg_color,
      card_bg_color: card_bg_color, // الحقل الجديد
      text_primary_color: text_primary_color, // الحقل الجديد
      text_secondary_color: text_secondary_color, // الحقل الجديد
    });

    // إعادة التحقق من الكاش لتحديث البيانات فوراً في الواجهات
    revalidatePath("/dashboard/settings");
    revalidatePath(`/r/${slug}`); 
    
    return { success: true };
  } catch (error: any) {
    console.error("Update Error:", error);
    if (error.code === 11000) return { error: "هذا الرابط (Slug) مستخدم بالفعل، اختر اسماً آخر" };
    return { error: "حدث خطأ أثناء التحديث" };
  }
}