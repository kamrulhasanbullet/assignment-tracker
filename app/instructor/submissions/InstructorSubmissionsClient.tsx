"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  User,
  ExternalLink,
  Save,
  Inbox,
  Terminal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ITEMS_PER_PAGE = 6;

const statusColors: Record<string, string> = {
  pending: "border-amber-500/50 bg-amber-500/10 text-amber-400",
  accepted: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
  needs_improvement: "border-rose-500/50 bg-rose-500/10 text-rose-400",
};

export default function InstructorSubmissionsClient({
  initialSubmissions,
}: {
  initialSubmissions: any[];
}) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [editing, setEditing] = useState<
    Record<string, { status: string; feedback: string }>
  >(() => {
    const init: Record<string, { status: string; feedback: string }> = {};
    initialSubmissions.forEach((s: any) => {
      init[s._id] = { status: s.status, feedback: s.feedback || "" };
    });
    return init;
  });

  // Pagination Logic
  const totalPages = Math.ceil(submissions.length / ITEMS_PER_PAGE);
  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return submissions.slice(start, start + ITEMS_PER_PAGE);
  }, [submissions, currentPage]);

  const handleUpdate = async (id: string) => {
    await fetch(`/api/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing[id]),
    });

    setSubmissions((prev: any[]) =>
      prev.map((s) => (s._id === id ? { ...s, ...editing[id] } : s)),
    );
  };

  const handleAIFeedback = async (submission: any) => {
    setAiLoading(submission._id);
    const res = await fetch("/api/ai/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentNote: submission.note,
        assignmentTitle: submission.assignmentId?.title || "Assignment",
        difficulty: submission.assignmentId?.difficulty || "beginner",
        status: editing[submission._id].status,
      }),
    });
    const data = await res.json();
    if (data.feedback) {
      setEditing((prev) => ({
        ...prev,
        [submission._id]: { ...prev[submission._id], feedback: data.feedback },
      }));
    }
    setAiLoading(null);
  };

  return (
    <div className="max-w-350 mx-auto space-y-8 py-8 px-0 sm:px-4 selection:bg-violet-500/30">
      {/* Header */}
      <div className="relative overflow-hidden bg-[#0f0f18]/60 border border-white/8 p-6 sm:p-10 rounded-[32px] backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-[100px] -z-10" />
        <div className="flex items-center gap-3 text-violet-500 font-black text-[10px] uppercase tracking-[0.3em] mb-3">
          <Terminal size={14} /> Mission Control Center
        </div>
        <h1 className="text-2xl sm:text-5xl font-black text-white tracking-tighter uppercase italic leading-tight py-2">
          Student{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-fuchsia-500 pr-4">
            Submissions
          </span>
        </h1>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {paginatedSubmissions.map((sub: any) => (
          <Card
            key={sub._id}
            className="group bg-[#0f0f18]/40 border-white/6 rounded-[40px] backdrop-blur-xl transition-all duration-500 hover:border-violet-500/30 overflow-hidden flex flex-col"
          >
            <CardHeader className="p-6 sm:px-8 sm:py-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-black text-white tracking-tight group-hover:text-violet-400 transition-colors leading-tight">
                    {sub.assignmentId?.title || "Classified Mission"}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    <User size={12} /> {sub.studentId?.name || "Agent Unknown"}
                  </div>
                </div>
                {/* Badge Text Bold & Larger */}
                <Badge
                  className={`shrink-0 md:h-8 md:px-4 md:text-[11px] h-6 px-3 text-[8px] font-black uppercase tracking-wider rounded-xl border shadow-lg transition-all ${statusColors[sub.status]}`}
                >
                  {sub.status.replace("_", " ")}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 pt-0 space-y-6 flex-1 flex flex-col">
              <div className="space-y-4">
                <div className="bg-white/3 border border-white/5 rounded-[24px] p-4 text-sm text-zinc-400 italic relative group/note">
                  <span className="absolute -top-2 left-4 px-2 bg-[#12121c] text-[9px] font-black uppercase tracking-widest text-zinc-600">
                    Student Note
                  </span>
                  "{sub.note || "No specific intel provided."}"
                </div>

                <a
                  href={sub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-violet-500/5 hover:bg-violet-500/10 border border-violet-500/10 rounded-2xl p-4 text-violet-400 transition-all group/link"
                >
                  <span className="text-[11px] font-black uppercase tracking-widest truncate mr-2">
                    Open Deployment
                  </span>
                  <ExternalLink size={16} />
                </a>
              </div>

              <div className="mt-auto pt-6 border-t border-white/5 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1">
                      Verdict Status
                    </label>
                    <Select
                      value={editing[sub._id].status}
                      onValueChange={(v) =>
                        setEditing((p) => ({
                          ...p,
                          [sub._id]: { ...p[sub._id], status: v },
                        }))
                      }
                    >
                      <SelectTrigger className="w-full bg-[#161622] border-white/8 text-white h-12 rounded-xl focus:ring-violet-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1c1c2b] border-white/10 text-white rounded-xl">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="needs_improvement">
                          Needs Improvement
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                        Briefing
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAIFeedback(sub)}
                        disabled={aiLoading === sub._id}
                        className="h-auto p-0 text-fuchsia-400 hover:text-fuchsia-300 hover:bg-transparent text-[10px] font-black uppercase tracking-widest"
                      >
                        {aiLoading === sub._id ? (
                          <Sparkles className="mr-1 animate-spin w-3 h-3" />
                        ) : (
                          <Sparkles className="mr-1 w-3 h-3" />
                        )}
                        AI Intel
                      </Button>
                    </div>
                    <Textarea
                      value={editing[sub._id].feedback}
                      onChange={(e) =>
                        setEditing((p) => ({
                          ...p,
                          [sub._id]: {
                            ...p[sub._id],
                            feedback: e.target.value,
                          },
                        }))
                      }
                      className="bg-[#161622]/50 border-white/8 text-white min-h-25 rounded-[20px] focus:ring-violet-500/30 text-sm leading-relaxed"
                      placeholder="Write feedback..."
                    />
                  </div>
                </div>

                <Button
                  onClick={() => handleUpdate(sub._id)}
                  className="w-full bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-widest h-12 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Save className="mr-2 w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="bg-[#0f0f18] border-white/10 text-white hover:bg-violet-500/20 rounded-full w-12 h-12"
          >
            <ChevronLeft size={20} />
          </Button>

          <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-zinc-400 text-xs font-black tracking-widest">
            PAGE <span className="text-white">{currentPage}</span> /{" "}
            {totalPages}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="bg-[#0f0f18] border-white/10 text-white hover:bg-violet-500/20 rounded-full w-12 h-12"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      )}

      {/* Empty State */}
      {submissions.length === 0 && (
        <div className="bg-[#0f0f18]/60 border border-dashed border-white/10 rounded-[40px] py-32 text-center backdrop-blur-xl">
          <Inbox className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
          <h3 className="text-zinc-500 font-black uppercase tracking-widest text-sm">
            No Missions Logged
          </h3>
        </div>
      )}
    </div>
  );
}
