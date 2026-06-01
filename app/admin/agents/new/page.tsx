import { AgentForm } from "@/components/admin/agent-form";

export default function NewAgentPage() {
  return (
    <div className="max-w-xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Add New Agent</h1>
        <p className="text-sm text-gray-500 mt-0.5">Create a new field agent account</p>
      </div>
      <AgentForm />
    </div>
  );
}
