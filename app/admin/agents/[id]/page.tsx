import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { AgentForm } from "@/components/admin/agent-form";

export default async function EditAgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = await prisma.user.findUnique({
    where: { id, role: "AGENT" },
    select: { id: true, name: true, email: true, phone: true, isActive: true },
  });
  if (!agent) notFound();

  return (
    <div className="max-w-xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Edit Agent</h1>
        <p className="text-sm text-gray-500 mt-0.5">{agent.name}</p>
      </div>
      <AgentForm agent={agent} />
    </div>
  );
}
