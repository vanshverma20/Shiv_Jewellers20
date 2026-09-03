import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@jewelry.test" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          const count = await prisma.user.count();
          const initialEmail = process.env.ADMIN_EMAIL;
          const initialPassword = process.env.ADMIN_PASSWORD;
          if (count === 0 && initialEmail && initialPassword && credentials.email === initialEmail && credentials.password === initialPassword) {
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            return await prisma.user.create({
              data: {
                email: credentials.email,
                name: "Super Admin",
                password: hashedPassword,
                role: "SUPER_ADMIN"
              }
            });
          }
          return null;
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin-login',
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
};
