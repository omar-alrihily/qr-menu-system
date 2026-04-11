import { Tajawal } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";
import { Metadata } from "next";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

// إعدادات الـ SEO الأساسية للموقع بالكامل
export const metadata: Metadata = {
  title: {
    template: "%s | فليكس منيو - FlexMenu",
    default: "فليكس منيو | أفضل نظام منيو إلكتروني QR للمطاعم والكافيهات",
  },
  description: "أنشئ منيو إلكتروني احترافي لمطعمك بلمسة زر. نظام طلبات واتساب، تصميم QR مخصص، وسرعة فائقة لتعزيز تجربة عملائك.",
  keywords: ["منيو الكتروني", "QR Menu", "منيو مطعم", "طلبات واتساب", "السعودية", "المدينة المنورة", "انشاء منيو"],
  authors: [{ name: "Omar" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.flexm.pro", // ضع رابط موقعك الحقيقي هنا
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://www.flexm.pro",
    title: "فليكس منيو | ابدأ التحول الرقمي لمطعمك",
    description: "أقوى نظام منيو تفاعلي في السعودية، جربه الآن مجاناً.",
    siteName: "FlexMenu",
  },
  icons: {
    icon: '/favicon.png', // المسار من مجلد public
    // يمكنك إضافة أحجام مختلفة أيضاً
    apple: '/apple-touch-icon.png',
  },
  
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.className} antialiased font-[tajawal]`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}