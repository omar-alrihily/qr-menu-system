"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="bg-orange-500 text-white px-6 py-2 rounded-lg text-sm font-black hover:bg-orange-600 transition-all flex items-center gap-2"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? "تم النسخ" : "نسخ الرابط"}
    </button>
  );
}