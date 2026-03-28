"use client";
import { useState } from "react";
import { resetPassword } from "@/lib/actions/auth"; // سننشئ هذه الدالة الآن
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("كلمتا المرور غير متطابقتين");
      return;
    }
    
    setLoading(true);
    const result = await resetPassword(token, password);
    setMessage(result.message);
    setLoading(false);

    if (result.success) {
      setTimeout(() => router.push("/login"), 3000); // تحويل للمسجل بعد 3 ثواني
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-8 border rounded shadow-md w-96 text-right">
        <h1 className="text-2xl font-bold mb-4">تعيين كلمة مرور جديدة</h1>
        <input
          type="password"
          placeholder="كلمة المرور الجديدة"
          className="w-full p-2 border mb-4 text-right"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="تأكيد كلمة المرور"
          className="w-full p-2 border mb-4 text-right"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button 
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded hover:bg-gray-800"
        >
          {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
        </button>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </form>
    </div>
  );
}