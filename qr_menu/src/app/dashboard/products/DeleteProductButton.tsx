"use client";
import { deleteProduct } from "@/lib/actions/product";

export default function DeleteProductButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟")) {
      const res = await deleteProduct(id);
      if (!res.success) alert(res.error);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="text-red-600 hover:text-red-800 font-medium text-sm cursor-pointer"
    >
      حذف
    </button>
  );
}