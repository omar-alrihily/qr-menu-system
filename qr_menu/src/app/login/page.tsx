"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // استدعاء وظيفة تسجيل الدخول من NextAuth
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // نمنع التوجيه التلقائي للتحكم في الأخطاء هنا
    });

    if (result?.error) {
      setError("الإيميل أو كلمة المرور غير صحيحة");
    } else {
      router.push("/dashboard"); // التوجيه للوحة التحكم عند النجاح
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow-md">
        <h2 className="text-center text-2xl font-bold text-gray-800">تسجيل دخول المطعم</h2>
        
        {error && <p className="text-sm text-red-500 bg-red-50 p-2 rounded border border-red-200">{error}</p>}
        
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          className="w-full border p-2 rounded focus:outline-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="كلمة المرور"
          className="w-full border p-2 rounded focus:outline-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button
          type="submit"
          className="w-full bg-blue-600 py-2 text-white rounded hover:bg-blue-700 transition"
        >
          دخول
        </button>

        <p className="text-center text-sm text-gray-600">
          ليس لديك حساب؟ <a href="/register" className="text-blue-500 hover:underline">سجل مطعمك الآن</a>
        </p>
      </form>
    </div>
  );
}