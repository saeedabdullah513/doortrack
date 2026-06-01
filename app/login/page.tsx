"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 via-red-700 to-rose-800 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-[-40px] w-48 h-48 rounded-full bg-white/5" />

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white/15 backdrop-blur rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">DoorTrack</h1>
          <p className="text-red-100 text-lg mt-3 max-w-xs">
            Door-to-Door Team Attendance &amp; Field Tracking
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-left">
            {[
              { label: "GPS Tracking", desc: "Every punch recorded with location" },
              { label: "Live Map", desc: "See your team in real time" },
              { label: "Reports", desc: "Daily & weekly summaries" },
              { label: "Multi-Session", desc: "Multiple punch in/out per day" },
            ].map((f) => (
              <div key={f.label} className="bg-white/10 rounded-xl p-4 border border-white/15">
                <p className="text-white font-semibold text-sm">{f.label}</p>
                <p className="text-red-100 text-xs mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6">
        {/* Mobile logo */}
        <div className="flex items-center gap-3 mb-8 lg:hidden">
          <div className="w-11 h-11 bg-red-600 rounded-2xl flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">DoorTrack</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-red-500" />
              <span className="text-xs font-semibold text-red-500 uppercase tracking-widest">Secure Login</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-1 mb-6">Welcome back</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  {error}
                </div>
              )}
              <Button type="submit" size="xl" loading={loading} className="mt-1 h-12 text-base rounded-xl">
                Sign In to DoorTrack
              </Button>
            </form>
          </div>

          <p className="text-center text-gray-400 text-xs mt-5">
            Forgot your password? Contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
