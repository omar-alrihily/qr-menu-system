"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { Category } from "@/models/Category";
import { revalidatePath } from "next/cache";

// 1. إضافة قسم
export async function createCategory(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "غير مصرح لك" };

  await dbConnect();
  await Category.create({
    restaurant_id: session.user.id,
    name_ar: formData.get("name_ar"),
    
    sort_order: Number(formData.get("sort_order")) || 0,
  });

  revalidatePath("/dashboard/categories");
  return { success: true };
}

// 2. تعديل قسم
export async function updateCategory(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "غير مصرح لك" };

  await dbConnect();
  await Category.findOneAndUpdate(
    { _id: id, restaurant_id: session.user.id },
    {
      name_ar: formData.get("name_ar"),
      
      sort_order: Number(formData.get("sort_order")) || 0,
    }
  );

  revalidatePath("/dashboard/categories");
  return { success: true };
}

// 3. حذف قسم
export async function deleteCategory(id: string) {
  const session = await auth();
  console.log("Session in Action:", session);
  if (!session?.user?.id) return { error: "غير مصرح لك" };

  await dbConnect();
  await Category.findOneAndDelete({ _id: id, restaurant_id: session.user.id });
  
  revalidatePath("/dashboard/categories");
  return { success: true };
}