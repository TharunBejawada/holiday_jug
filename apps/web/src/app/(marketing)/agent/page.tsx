import { redirect } from "next/navigation";

export default function AgentPage() {
  // Agent tool has been moved inside the Admin Dashboard.
  // Redirect callers to /admin/agent.
  redirect("/admin/agent");
}
