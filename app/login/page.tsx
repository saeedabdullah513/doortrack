"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) { setError("Invalid email or password."); return; }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="h-screen flex overflow-hidden">

      {/* ── Left panel — brand (desktop only) ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 via-red-700 to-rose-800 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 -right-10 w-80 h-80 rounded-full bg-white/10" />
        <div className="absolute top-1/3 right-0 w-40 h-40 rounded-full bg-white/5" />

        <div className="relative z-10 text-center w-full max-w-sm">
          {/* Logo */}
          <div className="w-20 h-20 bg-white/15 backdrop-blur rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-xl">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">DoorTrack</h1>
          <p className="text-red-100 text-base mt-3">
            Door-to-Door Team Attendance &amp; Field Tracking
          </p>

          {/* Feature tiles */}
          <div className="mt-10 grid grid-cols-2 gap-3 text-left">
            {[
              { label: "GPS Tracking",   desc: "Every punch recorded with location" },
              { label: "Live Map",       desc: "See your team in real time" },
              { label: "Reports",        desc: "Daily & weekly summaries" },
              { label: "Multi-Session",  desc: "Multiple punch in/out per day" },
            ].map((f) => (
              <div key={f.label} className="bg-white/10 hover:bg-white/15 transition-colors rounded-2xl p-4 border border-white/15">
                <p className="text-white font-semibold text-sm">{f.label}</p>
                <p className="text-red-100 text-xs mt-1 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center bg-white relative overflow-hidden">
        {/* Subtle dot grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 w-full max-w-md px-8">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="w-11 h-11 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-gray-900">DoorTrack</span>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
            {/* Header */}
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-red-500" />
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                  Secure Login
                </span>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900">Welcome back</h2>
              <p className="text-gray-400 text-sm mt-1.5">
                Sign in to your DoorTrack account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                id="email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Input
                id="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />

              {error && (
                <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                size="xl"
                loading={loading}
                className="h-13 text-base rounded-xl mt-1 shadow-lg shadow-red-100"
              >
                Sign In to DoorTrack
              </Button>
            </form>
          </div>

          <p className="text-center text-gray-400 text-xs mt-5">
            Forgot your password?{" "}
            <a href="/forgot-password" className="text-red-600 font-medium hover:underline">Reset it here.</a>
          </p>
        </div>
      </div>

    </div>
  );
}
