import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { Restaurant } from "@/models/Restaurant";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        await dbConnect();

        if (!credentials?.email || !credentials?.password) return null;

        const restaurant = await Restaurant.findOne({ 
          email: (credentials.email as string).toLowerCase() 
        });

        // إذا لم يجد المطعم أو لم توجد كلمة مرور (في حال سجل بجوجل مثلاً)
        if (!restaurant || !restaurant.password) return null;

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          restaurant.password
        );

        if (isPasswordCorrect) {
          return {
            id: restaurant._id.toString(),
            name: restaurant.name,
            email: restaurant.email,
          };
        }
        
        return null;
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