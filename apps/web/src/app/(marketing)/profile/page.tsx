import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/api-auth";
import { prisma } from "@holiday-jug/db";
import { ProfileView } from "@/components/dashboard/ProfileView";

export default async function ProfilePage() {
  const session = await getCurrentSession();
  if (!session?.user) redirect("/login");

  const userId = (session.user as { id?: string }).id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/login");

  return (
    <ProfileView
      user={{
        name: user.name,
        email: user.email,
        phone: user.phone,
        addressLine1: user.addressLine1,
        addressLine2: user.addressLine2,
        city: user.city,
        postcode: user.postcode,
        country: user.country,
        preferredCurrency: user.preferredCurrency,
        marketingOptIn: user.marketingOptIn,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt.toISOString(),
        lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
        loginCount: user.loginCount,
      }}
    />
  );
}
