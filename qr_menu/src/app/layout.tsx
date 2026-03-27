import { Tajawal } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";




const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-tajawal", // تعريف متغير CSS
});




export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl " >
      <body className={`${tajawal.className} antialiased font-[tajawal] `} >
        
        <AuthProvider>{children}</AuthProvider>
        
        </body>
    </html>
  )
}