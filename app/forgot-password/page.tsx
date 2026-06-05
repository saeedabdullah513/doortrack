"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setResetLink(null);
    setLoading(true);

    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setMessage({ type: "error", text: data?.error || "Unable to process request." });
      return;
    }

    setMessage({ type: "success", text: "If this email exists, a password reset link has been generated." });
    if (data?.resetUrl) {
      setResetLink(data.resetUrl);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white border border-gray-200 rounded-3xl shadow-sm p-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your email to receive a password reset link.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            id="forgot-email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" loading={loading} className="w-full">
            Send Reset Link
          </Button>
        </form>

        {message && (
          <div className={`rounded-2xl px-4 py-3 text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {message.text}
          </div>
        )}

        {resetLink && (
          <div className="rounded-2xl p-4 bg-gray-50 border border-gray-200 text-sm text-gray-800">
            <p className="font-semibold mb-2">Reset link:</p>
            <a href={resetLink} className="text-red-600 hover:underline break-all">
              {origin ? `${origin}${resetLink}` : resetLink}
            </a>
          </div>
        )}

        <p className="text-sm text-gray-500">
          Remembered your password? <Link href="/login" className="text-red-600 hover:underline">Sign in</Link>.
        </p>
      </div>
    </div>
  );
}
