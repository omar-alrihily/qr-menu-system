import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb-client";
import { Restaurant } from "@/models/Restaurant";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          // 1. التأكد من الاتصال بقاعدة البيانات قبل أي شيء
          await dbConnect();

          // 2. التحقق من وجود البيانات المرسلة لتجنب أخطاء undefined
          if (!credentials?.email || !credentials?.password) return null;

          // 3. البحث عن المطعم مع معالجة حالة الحروف (اختياري لكن مفيد)
          const restaurant = await Restaurant.findOne({ 
            email: (credentials.email as string).toLowerCase() 
          });

          if (!restaurant) return null;

          // 4. مقارنة كلمة المرور
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password as string,
            restaurant.password
          );

          if (!isPasswordCorrect) return null;

          // 5. إرجاع البيانات بشكل نظيف
          return {
            id: restaurant._id.toString(),
            name: restaurant.name,
            email: restaurant.email,
          };
        } catch (error) {
          // تسجيل الخطأ تقنياً في السيرفر لتعرف إذا كانت المشكلة SSL أو قاعدة بيانات
          console.error("Auth Error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});