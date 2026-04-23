"use client";
import { useState } from "react";
import { updateCategory, deleteCategory } from "@/lib/actions/category";

export default function CategoryRow({ category }: { category: any }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <tr className="border-b bg-blue-50/30 transition-all">
        <td colSpan={3} className="p-4">
          <form action={async (formData) => {
            await updateCategory(category._id, formData);
            setIsEditing(false);
          }} className="flex gap-4 items-center">
            <input name="name_ar" defaultValue={category.name_ar} className="flex-1 p-2 border rounded" required />
            
            <input name="sort_order" type="number" defaultValue={category.sort_order} className="w-20 p-2 border rounded" />
            <button type="submit" className="text-green-600 font-bold px-3">حفظ</button>
            <button type="button" onClick={() => setIsEditing(false)} className="text-gray-400">إلغاء</button>
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50 transition">
      <td className="p-4">
        <div className="font-medium text-gray-800">{category.name_ar}</div>
        
      </td>
      <td className="p-4 text-center">{category.sort_order}</td>
      <td className="p-4 text-center flex justify-center gap-4">
        <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-700 cursor-pointer text-sm">تعديل</button>
        <button onClick={() => { if(confirm('هل أنت متأكد؟')) deleteCategory(category._id) }} className="text-red-400 hover:text-red-600 cursor-pointer text-sm">حذف</button>
      </td>
    </tr>
  );
}