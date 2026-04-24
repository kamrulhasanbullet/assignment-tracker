"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = (session?.user as any)?.role;

  const instructorLinks = [
    { href: "/instructor/dashboard", label: "Dashboard" },
    { href: "/instructor/assignments", label: "Assignments" },
    { href: "/instructor/submissions", label: "Submissions" },
  ];

  const studentLinks = [
    { href: "/student/assignments", label: "Assignments" },
    { href: "/student/submissions", label: "My Submissions" },
  ];

  const links = role === "instructor" ? instructorLinks : studentLinks;

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-white font-bold text-xl flex items-center gap-2"
          >
            <span>📚</span> LearnFlow
          </Link>
          <div className="flex gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  pathname === link.href
                    ? "bg-purple-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={`capitalize border-0 ${
              role === "instructor"
                ? "bg-purple-600/20 text-purple-300"
                : "bg-blue-600/20 text-blue-300"
            }`}
          >
            {role}
          </Badge>
          <span className="text-slate-400 text-sm">{session?.user?.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-slate-400 hover:text-white"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
