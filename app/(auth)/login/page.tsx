"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      if (session?.user?.role === "instructor") {
        router.push("/instructor/dashboard");
      } else {
        router.push("/student/assignments");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c14] flex items-center justify-center px-4 relative overflow-hidden">
      {/* ── Ambient blobs ── */}
      <div className="absolute -top-44 -left-36 w-125 h-125 rounded-full bg-indigo-600 opacity-15 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-24 w-100 h-100 rounded-full bg-violet-600 opacity-10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-cyan-500 opacity-5 blur-[80px] pointer-events-none" />

      {/* ── Subtle grid ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      {/* ── Card ── */}
      <Card className="relative z-10 w-full max-w-105 bg-white/3 border border-white/8 rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl text-slate-200 gap-0">
        <CardHeader className="p-8 pb-6">
          {/* Brand */}
          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl bg-linear-to-br from-indigo-400 to-violet-500 bg-clip-text text-transparent select-none">
              ⬡
            </span>
            <span className="text-base font-bold tracking-tight text-slate-200">
              LearnForge
            </span>
          </div>

          <CardTitle className="text-[1.75rem] font-bold tracking-tight text-slate-100 leading-tight p-0">
            Welcome back
          </CardTitle>
          <CardDescription className="text-slate-500 text-sm mt-1 p-0">
            Sign in to continue your learning journey
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-medium text-slate-400 tracking-wide"
              >
                Email address
              </Label>
              <div className="relative">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <rect
                    x="1"
                    y="3.5"
                    width="14"
                    height="9"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <path
                    d="M1 5.5l7 4.5 7-4.5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/4 border-white/10 text-slate-200 placeholder:text-slate-600 rounded-xl py-3 h-auto focus-visible:border-indigo-500 focus-visible:bg-indigo-500/6 focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:ring-offset-0 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs font-medium text-slate-400 tracking-wide"
                >
                  Password
                </Label>
                <a
                  href="#"
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors duration-150"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <rect
                    x="3"
                    y="7"
                    width="10"
                    height="8"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <path
                    d="M5 7V5a3 3 0 016 0v2"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/4 border-white/10 text-slate-200 placeholder:text-slate-600 rounded-xl py-3 h-auto focus-visible:border-indigo-500 focus-visible:bg-indigo-500/6 focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:ring-offset-0 transition-all duration-200"
                />
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-300">
                <svg
                  className="w-4 h-4 shrink-0"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="7"
                    stroke="#f87171"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 5v4M8 11v.5"
                    stroke="#f87171"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-1 py-3 h-auto bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 disabled:opacity-50 rounded-xl text-sm font-semibold text-white shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_28px_rgba(99,102,241,0.45)] hover:-translate-y-px active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </Button>
          </form>
        </CardContent>

        <div className="px-8 py-5 border-t border-white/8 bg-white/2 rounded-b-2xl flex justify-center">
          <p className="text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-150"
            >
              Create one free
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
