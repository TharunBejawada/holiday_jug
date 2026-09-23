import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/api-auth";
import { prisma } from "@holiday-jug/db";
import { DashboardView } from "@/components/dashboard/DashboardView";

export default async function DashboardPage() {
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as { id?: string }).id;

  const [user, savedCount, bookingCount, recentSearches] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.savedPackage.count({ where: { userId } }),
    prisma.booking.count({ where: { userId } }),
    prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardView
      name={user.name}
      email={user.email}
      memberSince={user.createdAt.toISOString()}
      savedCount={savedCount}
      bookingCount={bookingCount}
      recentSearches={recentSearches.map((s) => ({
        id: s.id,
        destination: s.destination,
        nights: s.nights,
        createdAt: s.createdAt.toISOString(),
      }))}
    />
  );
}
