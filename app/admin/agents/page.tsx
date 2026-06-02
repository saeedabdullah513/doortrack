import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentActions } from "@/components/admin/agent-actions";

export default async function AdminAgentsPage() {
  const agents = await prisma.user.findMany({
    where: { role: "AGENT" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Agents</h1>
          <p className="text-sm text-gray-500 mt-0.5">{agents.length} total agents</p>
        </div>
        <Link href="/admin/agents/new">
          <Button size="md">
            <UserPlus className="w-4 h-4" />
            Add Agent
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Joined</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {agents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                    No agents yet.
                  </td>
                </tr>
              )}
              {agents.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{a.name}</td>
                  <td className="px-4 py-3 text-gray-600">{a.email}</td>
                  <td className="px-4 py-3 text-gray-500">{a.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(a.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      a.isActive
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : "bg-gray-100 text-gray-400 border border-gray-200"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${a.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                      {a.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/admin/agents/${a.id}/history`}
                        className="text-xs font-medium text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        History
                      </Link>
                      <AgentActions
                        agentId={a.id}
                        agentName={a.name}
                        isActive={a.isActive}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
