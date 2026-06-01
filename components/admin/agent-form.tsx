"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AgentData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
}

export function AgentForm({ agent }: { agent?: AgentData }) {
  const router = useRouter();
  const isEdit = !!agent;

  const [form, setForm] = useState({
    name: agent?.name ?? "",
    email: agent?.email ?? "",
    phone: agent?.phone ?? "",
    password: "",
    isActive: agent?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isEdit ? `/api/agents/${agent!.id}` : "/api/agents";
    const method = isEdit ? "PUT" : "POST";
    const body: Record<string, unknown> = {
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      isActive: form.isActive,
    };
    if (form.password) body.password = form.password;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save agent.");
      return;
    }
    router.push("/admin/agents");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4"
    >
      <Input
        id="name"
        label="Full Name"
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
        required
        placeholder="Ali Hassan"
      />
      <Input
        id="email"
        type="email"
        label="Email"
        value={form.email}
        onChange={(e) => set("email", e.target.value)}
        required
        placeholder="ali@example.com"
      />
      <Input
        id="phone"
        type="tel"
        label="Phone (optional)"
        value={form.phone}
        onChange={(e) => set("phone", e.target.value)}
        placeholder="+92 300 0000000"
      />
      <Input
        id="password"
        type="password"
        label={isEdit ? "New Password (leave blank to keep current)" : "Password"}
        value={form.password}
        onChange={(e) => set("password", e.target.value)}
        required={!isEdit}
        placeholder="••••••••"
        autoComplete="new-password"
      />
      {isEdit && (
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            checked={form.isActive}
            onChange={(e) => set("isActive", e.target.checked)}
            className="w-4 h-4 accent-red-600"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Account Active
          </label>
        </div>
      )}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {isEdit ? "Save Changes" : "Create Agent"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
