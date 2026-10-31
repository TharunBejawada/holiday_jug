import { redirect } from "next/navigation";

export default function AgentPage({
  searchParams,
}: {
  searchParams: Promise<{ searchId?: string }> | { searchId?: string };
}) {
  // Agent tool has been moved inside the Admin Dashboard.
  // Redirect callers to /admin/agent.
  redirect("/admin/agent");
}
