"use server"
import dbConnect from "@/lib/dbConnect";
import { Restaurant } from "@/models/Restaurant";
import bcrypt from "bcryptjs";

export async function registerRestaurant(formData: FormData) {
  try {
    await dbConnect();
    
    const email = (formData.get("email") as string).toLowerCase();
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;

    // تحقق بسيط قبل البدء
    const existing = await Restaurant.findOne({ email });
    if (existing) return { success: false, message: "البريد الإلكتروني مسجل مسبقاً" };

    const hashedPassword = await bcrypt.hash(password, 10);

    await Restaurant.create({
      name,
      email,
      password: hashedPassword,
      slug,
      whatsapp: formData.get("whatsapp")
    });

    return { success: true };
  } catch (error) {
    console.error("Register Error:", error);
    return { success: false, message: "حدث خطأ أثناء الإنشاء، تأكد من البيانات" };
  }
}