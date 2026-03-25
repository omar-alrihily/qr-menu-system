"use server"
import dbConnect from "@/lib/dbConnect";
import { Restaurant } from "@/models/Restaurant";
import bcrypt from "bcryptjs";

export async function registerRestaurant(formData: FormData) {
  await dbConnect();
  
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const whatsapp = formData.get("whatsapp") as string;

  // 1. تشفير كلمة المرور
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await Restaurant.create({
      name,
      email,
      password: hashedPassword,
      slug,
      whatsapp
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: "الايميل أو الـ slug مستخدم بالفعل" };
  }
}