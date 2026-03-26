import QRCode from 'qrcode';
import { Restaurant } from "@/models/Restaurant";
import dbConnect from "@/lib/dbConnect";

export async function generateAndSaveQR(restaurantId: string, slug: string) {
  try {
    await dbConnect();

    // 1. الرابط الكامل للمنيو
    const menuUrl = `https://menu.com/r/${slug}`;

    // 2. توليد الـ QR Code بصيغة Data URL (صورة Base64)
    // يمكنك تخصيص الألوان لتناسب هوية المطعم
    const qrImage = await QRCode.toDataURL(menuUrl, {
      errorCorrectionLevel: 'H', // دقة عالية لضمان القراءة حتى مع الخدوش
      margin: 2,
      color: {
        dark: '#ea580c', // لون البرتقالي (مثل التصميم السابق)
        light: '#ffffff', // خلفية بيضاء
      },
      width: 500 // عرض الصورة
    });

    // 3. تحديث قاعدة البيانات بمسار الصورة أو الـ Base64
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { qr_code: qrImage },
      { new: true }
    );

    return { success: true, qrImage };
  } catch (err) {
    console.error("QR Generation Error:", err);
    return { success: false };
  }
}