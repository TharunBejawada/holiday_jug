import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma, ensureEnvLoaded } from "@holiday-jug/db";
import { compare, hash } from "bcryptjs";

function buildAuthOptions(): NextAuthOptions {
  return {
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

          await ensureEnvLoaded();
          const cleanEmail = credentials.email.trim().toLowerCase();

          let user = await prisma.user.findFirst({
            where: {
              email: { equals: cleanEmail, mode: "insensitive" },
            },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
              passwordHash: true,
            },
          });

          // Auto-bootstrap fallback for root admin accounts if database lacks seed
          if (!user && (cleanEmail === "superadmin@holidayjug.com" || cleanEmail === "admin@holidayjug.com")) {
            try {
              const defaultPasswordHash = await hash("HolidayJug2026!", 12);
              user = await prisma.user.create({
                data: {
                  email: cleanEmail,
                  name: cleanEmail === "superadmin@holidayjug.com" ? "Super Admin" : "HolidayJug Admin",
                  role: "ADMIN",
                  status: "ACTIVE",
                  passwordHash: defaultPasswordHash,
                  emailVerified: new Date(),
                },
                select: {
                  id: true,
                  email: true,
                  name: true,
                  role: true,
                  status: true,
                  passwordHash: true,
                },
              });
            } catch (createErr) {
              console.error("[auth] Fallback admin auto-provisioning failed:", createErr);
            }
          }

          if (!user?.passwordHash) return null;
          if (user.status !== "ACTIVE") return null;

          const valid = await compare(credentials.password, user.passwordHash);
          if (!valid) return null;

          const ip =
            req?.headers?.["x-forwarded-for"]?.toString().split(",")[0]?.trim() ?? null;

          // Non-blocking background audit update to avoid delaying login response
          prisma.user
            .update({
              where: { id: user.id },
              data: {
                loginCount: { increment: 1 },
                lastLoginAt: new Date(),
                lastLoginIp: ip,
              },
            })
            .catch((err) => {
              console.error("[auth] Failed to update user login audit metadata:", err);
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
}

// NextAuthOptions.secret (and everything else here) is read once when this
// object is built — on Amplify's compute, runtime secrets only land in
// process.env after ensureEnvLoaded() resolves (see docs/DEPLOYMENT.md), so
// building this eagerly at module-load time bakes in an undefined secret on
// cold start. Every consumer must await this instead of importing a static
// authOptions constant.
export async function getAuthOptions(): Promise<NextAuthOptions> {
  await ensureEnvLoaded();
  return buildAuthOptions();
}
