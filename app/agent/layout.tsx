import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AgentNav } from "@/components/agent/agent-nav";

export default async function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || session.user.role !== "AGENT") redirect("/login");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 pb-20">{children}</main>
      <AgentNav />
    </div>
  );
}
