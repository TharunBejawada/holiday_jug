import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@holiday-jug/db";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    // Used by both customers (after the OTP-verified signup flow sets a
    // password) and admin/back-office accounts.
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user?.passwordHash) return null;
        if (user.status !== "ACTIVE") return null;

        const valid = await compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        const ip =
          req?.headers?.["x-forwarded-for"]?.toString().split(",")[0]?.trim() ?? null;

        await prisma.user.update({
          where: { id: user.id },
          data: {
            loginCount: { increment: 1 },
            lastLoginAt: new Date(),
            lastLoginIp: ip,
          },
        });

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
        (session.user as { role?: string; id?: string }).role = token.role as string | undefined;
        (session.user as { role?: string; id?: string }).id = token.sub;
      }
      return session;
    },
  },
};
