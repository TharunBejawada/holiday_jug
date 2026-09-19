import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@holiday-jug/db";
import { compare } from "bcryptjs";
import { sendVerificationEmail } from "./ses";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    verifyRequest: "/login/check-email",
  },
  providers: [
    // Passwordless sign-up/sign-in: we email a one-time link instead of
    // asking for an SMS OTP, which is far costlier and less reliable to
    // verify across international numbers than email.
    EmailProvider({
      from: process.env.SES_FROM_EMAIL,
      maxAge: 15 * 60, // magic link valid for 15 minutes
      sendVerificationRequest: async ({ identifier, url }) => {
        await sendVerificationEmail(identifier, url);
      },
    }),
    // Kept for admin/back-office accounts that need a traditional password.
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user?.passwordHash) return null;

        const valid = await compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string | undefined;
      }
      return session;
    },
  },
};
