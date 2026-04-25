"use client";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  BookOpen,
  LayoutDashboard,
  ClipboardList,
  FileCheck,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = (session?.user as any)?.role;
  const [mobileOpen, setMobileOpen] = useState(false);

  const instructorLinks = [
    {
      href: "/instructor/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    { href: "/instructor/assignments", label: "Assignments", icon: BookOpen },
    {
      href: "/instructor/submissions",
      label: "Submissions",
      icon: ClipboardList,
    },
  ];

  const studentLinks = [
    { href: "/student/assignments", label: "Assignments", icon: BookOpen },
    { href: "/student/submissions", label: "My Submissions", icon: FileCheck },
  ];

  const links = role === "instructor" ? instructorLinks : studentLinks;

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/6 bg-[#0a0a0f]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold text-[15px] tracking-tight">
              Learn<span className="text-violet-400">Flow</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                    active
                      ? "bg-violet-500/15 text-violet-300"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/4 border border-white/6">
              <div className="w-6 h-6 rounded-full bg-linear-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                {session?.user?.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-zinc-300 text-[13px] font-medium max-w-30 truncate">
                {session?.user?.name}
              </span>
              <Badge
                className={`text-[10px] px-2 py-0 h-4 font-semibold capitalize border-0 shrink-0 ${
                  role === "instructor"
                    ? "bg-violet-500/20 text-violet-300"
                    : "bg-sky-500/20 text-sky-300"
                }`}
              >
                {role}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-zinc-500 hover:text-zinc-200 hover:bg-white/5 h-8 w-8 p-0 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-5 h-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown with framer-motion */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden fixed top-16 inset-x-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/6 px-4 py-4 space-y-1 shadow-2xl"
          >
            {/* links stagger in one by one */}
            {links.map((link, i) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-violet-500/15 text-violet-300"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}

            <div className="h-px bg-white/6 my-2" />
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: links.length * 0.05, duration: 0.2 }}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/3 border border-white/6"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-[11px] font-bold text-white">
                  {session?.user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-zinc-200 text-sm font-medium leading-tight">
                    {session?.user?.name}
                  </p>
                  <Badge
                    className={`text-[10px] px-1.5 py-0 h-4 font-semibold capitalize border-0 mt-0.5 ${
                      role === "instructor"
                        ? "bg-violet-500/20 text-violet-300"
                        : "bg-sky-500/20 text-sky-300"
                    }`}
                  >
                    {role}
                  </Badge>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 text-xs font-medium transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
