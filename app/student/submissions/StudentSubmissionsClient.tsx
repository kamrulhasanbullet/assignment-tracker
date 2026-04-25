"use client";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";

type Submission = {
  _id: string;
  note: string;
  url: string;
  status: "pending" | "accepted" | "needs_improvement";
  feedback?: string;
  createdAt: string;
  assignmentId?: {
    title?: string;
    difficulty?: "beginner" | "intermediate" | "advanced";
  };
};

const statusConfig: Record<
  Submission["status"],
  { color: string; icon: any; label: string; border: string }
> = {
  pending: {
    color: "bg-amber-500/10 text-amber-400",
    border: "border-amber-500/20",
    icon: Clock,
    label: "Pending Review",
  },
  accepted: {
    color: "bg-emerald-500/10 text-emerald-400",
    border: "border-emerald-500/20",
    icon: CheckCircle2,
    label: "Accepted",
  },
  needs_improvement: {
    color: "bg-rose-500/10 text-rose-400",
    border: "border-rose-500/20",
    icon: AlertCircle,
    label: "Re-work Needed",
  },
};

const difficultyColors: Record<string, string> = {
  beginner: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  intermediate: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  advanced: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
};

export default function StudentSubmissionsClient({
  submissions,
}: {
  submissions: Submission[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination Logic
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return submissions.slice(start, start + itemsPerPage);
  }, [submissions, currentPage]);

  const totalPages = Math.ceil(submissions.length / itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto space-y-10 px-4 py-8">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute -left-4 top-0 w-1 h-full bg-violet-600 rounded-full shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
        <h1 className="text-4xl font-black text-white tracking-tight uppercase">
          My <span className="text-violet-500">Missions</span>
        </h1>
        <p className="text-zinc-500 text-sm font-medium mt-1 tracking-wide italic">
          Archive of your digital deployments and intel reports.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon;
          return (
            <Card
              key={status}
              className="bg-zinc-900/50 border-white/5 backdrop-blur-xl group hover:border-violet-500/30 transition-all duration-300"
            >
              <CardContent className="p-3 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
                <div>
                  <p className="text-zinc-500 text-[8px] sm:text-xs font-bold uppercase tracking-widest">
                    {config.label}
                  </p>
                  <p className="text-xl sm:text-3xl font-black text-white mt-1">
                    {submissions.filter((s) => s.status === status).length}
                  </p>
                </div>
                <div
                  className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${config.color} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submissions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paginatedData.map((sub) => {
          const statusInfo =
            statusConfig[sub.status] || statusConfig["pending"];
          const StatusIcon = statusInfo.icon;

          return (
            <Card
              key={sub._id}
              className="bg-[#0f0f18] border-white/6 hover:border-white/12 transition-all duration-500 group overflow-hidden"
            >
              <div className="p-6 space-y-6">
                {/* Top Row */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-1">
                      {sub.assignmentId?.title || "Classified Mission"}
                    </h3>
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">
                        {new Date(sub.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      className={`rounded-md px-2 py-0.5 border text-[10px] font-bold uppercase tracking-widest shadow-sm ${statusInfo.color} ${statusInfo.border}`}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" /> {statusInfo.label}
                    </Badge>
                    {sub.assignmentId?.difficulty && (
                      <Badge
                        className={`rounded-md px-2 py-0.5 border text-[10px] font-bold lowercase ${difficultyColors[sub.assignmentId.difficulty]}`}
                      >
                        #{sub.assignmentId.difficulty}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content Sections */}
                <div className="grid gap-3">
                  <div className="bg-white/2 border border-white/5 rounded-xl p-4">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">
                      Deploy Intel (Notes)
                    </p>
                    <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 italic">
                      "{sub.note}"
                    </p>
                  </div>

                  <div className="bg-white/2 border border-white/5 rounded-xl p-4 flex items-center justify-between group/link">
                    <div className="truncate pr-4">
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">
                        Source Code / Live
                      </p>
                      <p className="text-violet-400 text-xs truncate font-mono">
                        {sub.url}
                      </p>
                    </div>
                    <a
                      href={sub.url}
                      target="_blank"
                      className="p-2 bg-violet-600/10 hover:bg-violet-600 text-violet-400 hover:text-white rounded-lg transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Feedback Section */}
                {sub.feedback ? (
                  <div className="relative bg-violet-600/5 border border-violet-500/20 rounded-2xl p-4 mt-2">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-4 h-4 text-violet-400 mt-1 shrink-0" />
                      <div>
                        <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">
                          Instructor Intel
                        </p>
                        <p className="text-zinc-300 text-sm leading-relaxed">
                          {sub.feedback}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-3 border border-dashed border-white/5 rounded-2xl">
                    <p className="text-zinc-600 text-xs font-medium tracking-tight">
                      Awaiting feedback from HQ...
                    </p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {submissions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[40px] bg-zinc-900/20">
          <div className="p-6 bg-zinc-800/50 rounded-full mb-4">
            <Inbox className="w-12 h-12 text-zinc-700" />
          </div>
          <h3 className="text-xl font-bold text-white">No deployments found</h3>
          <p className="text-zinc-500 mt-2">
            Time to start your first mission, Agent.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-xl bg-zinc-900 border-white/10 hover:bg-violet-600 hover:text-white transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPage === i + 1
                    ? "bg-violet-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                    : "bg-zinc-900 text-zinc-500 hover:text-white border border-white/5"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-xl bg-zinc-900 border-white/10 hover:bg-violet-600 hover:text-white transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
