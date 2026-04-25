"use client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  ShieldCheck,
  Target,
  Zap,
} from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const difficultyConfig: Record<
  string,
  { color: string; label: string; icon: any }
> = {
  beginner: {
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    label: "Beginner",
    icon: Zap,
  },
  intermediate: {
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    label: "Intermediate",
    icon: Target,
  },
  advanced: {
    color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    label: "Advanced",
    icon: ShieldCheck,
  },
};

export default function StudentAssignmentsClient({
  initialAssignments,
  userSubmissions = [],
}: {
  initialAssignments: any[];
  userSubmissions?: any[];
}) {
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Adjusted for 4-column grid

  const sortedAndFiltered = useMemo(() => {
    let list = [...initialAssignments].sort(
      (a, b) =>
        new Date(b.createdAt || b.deadline).getTime() -
        new Date(a.createdAt || a.deadline).getTime(),
    );
    if (filter !== "all") list = list.filter((a) => a.difficulty === filter);
    return list;
  }, [initialAssignments, filter]);

  const totalPages = Math.ceil(sortedAndFiltered.length / itemsPerPage);
  const paginatedItems = sortedAndFiltered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [form, setForm] = useState({ url: "", note: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const checkSubmission = (id: string) =>
    userSubmissions.find((s) => s.assignmentId === id);
  const isPast = (deadline: string) => new Date(deadline) < new Date();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: selectedAssignment._id,
          url: form.url,
          note: form.note,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSuccess("Mission Accomplished!");
      setTimeout(() => {
        setIsSubmitOpen(false);
        setSuccess("");
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const modalClass =
    "bg-[#08080c] border-white/[0.08] text-white w-[95vw] sm:max-w-xl max-h-[90vh] flex flex-col p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 rounded-[32px] ring-1 ring-white/10";

  return (
    <div className="max-w-350 mx-auto px-4 py-12 space-y-12">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-1 bg-violet-600 rounded-full" />
            <span className="text-violet-500 text-xs font-black uppercase tracking-[0.3em]">
              Operational Phase
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase">
            Available{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-fuchsia-500">
              Missions
            </span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">
            Select a challenge and deploy your code to the command center.
          </p>
        </div>

        <div className="flex p-1.5 bg-zinc-900/50 border border-white/8 rounded-2xl backdrop-blur-md overflow-x-auto no-scrollbar shadow-inner">
          {["all", "beginner", "intermediate", "advanced"].map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setCurrentPage(1);
              }}
              className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${
                filter === f
                  ? "bg-violet-600 text-white shadow-[0_10px_20px_rgba(124,58,237,0.3)]"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Modern Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {paginatedItems.map((assignment) => {
          const past = isPast(assignment.deadline);
          const cfg =
            difficultyConfig[assignment.difficulty] ||
            difficultyConfig.beginner;
          const submission = checkSubmission(assignment._id);
          const DifficultyIcon = cfg.icon;

          return (
            <div
              key={assignment._id}
              className={`group relative h-full rounded-[32px] transition-all duration-500 ${past ? "opacity-40 grayscale" : "hover:-translate-y-2"}`}
            >
              {/* Card Background & Border */}
              <div className="absolute inset-0 bg-linear-to-b from-white/8 to-transparent rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative h-full bg-[#0f0f18]/60 border border-white/8 p-7 rounded-[31px] flex flex-col backdrop-blur-xl group-hover:border-violet-500/50 transition-colors overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-violet-600/10 blur-[50px] group-hover:bg-violet-600/20 transition-all" />

                <div className="flex justify-between items-center mb-6">
                  <span
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-tight ${cfg.color}`}
                  >
                    <DifficultyIcon size={12} />
                    {cfg.label}
                  </span>
                  {submission && (
                    <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold">
                      <CheckCircle className="w-4 h-4" />
                      DONE
                    </div>
                  )}
                </div>

                <h3 className="text-white text-xl font-bold leading-snug group-hover:text-violet-400 transition-colors mb-3">
                  {assignment.title}
                </h3>

                <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 mb-8">
                  {assignment.description}
                </p>

                <div className="mt-auto space-y-5">
                  <div className="flex items-center justify-between text-zinc-500 text-[11px] font-bold uppercase tracking-widest bg-white/3 p-3 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-violet-500" />
                      <span>
                        {new Date(assignment.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full h-12 bg-white/5 border border-white/1 hover:bg-violet-600 hover:text-white hover:border-transparent rounded-2xl font-black text-[11px] uppercase tracking-widest cursor-pointer transition-all shadow-lg">
                        View Briefing
                      </Button>
                    </DialogTrigger>

                    <DialogContent className={modalClass}>
                      <DialogHeader className="p-8 pb-4">
                        <VisuallyHidden>
                          <DialogTitle>{assignment.title}</DialogTitle>
                        </VisuallyHidden>
                        <span
                          className={`inline-flex items-center gap-2 self-start px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest mb-4 ${cfg.color}`}
                        >
                          <DifficultyIcon size={12} /> {cfg.label}
                        </span>
                        <h2 className="text-3xl font-black text-white tracking-tighter leading-tight uppercase italic underline decoration-violet-600 decoration-4 underline-offset-8">
                          {assignment.title}
                        </h2>
                      </DialogHeader>

                      <div className="px-8 flex-1 overflow-y-auto space-y-8 pb-8 custom-scrollbar">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-5 rounded-3xl bg-zinc-900/50 border border-white/5 flex flex-col items-center">
                            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-2">
                              Status
                            </p>
                            <p
                              className={`text-sm font-black uppercase ${submission ? "text-emerald-400" : "text-amber-400"}`}
                            >
                              {submission ? "Encrypted & Sent" : "In Progress"}
                            </p>
                          </div>
                          <div className="p-5 rounded-3xl bg-zinc-900/50 border border-white/5 flex flex-col items-center">
                            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-2">
                              Deadline
                            </p>
                            <p className="text-sm font-black text-white uppercase">
                              {new Date(
                                assignment.deadline,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="flex items-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">
                            <div className="w-2 h-2 bg-violet-600 rounded-full animate-pulse" />
                            Mission Protocol
                          </h4>
                          <p className="text-zinc-400 leading-loose whitespace-pre-wrap text-base font-medium">
                            {assignment.description}
                          </p>
                        </div>
                      </div>

                      <div className="p-8 bg-zinc-900/80 border-t border-white/8 backdrop-blur-md">
                        {submission ? (
                          <div className="space-y-4">
                            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black text-zinc-500 uppercase">
                                  Submission Link
                                </span>
                                <span className="text-xs font-bold text-emerald-400 truncate max-w-50">
                                  {submission.url}
                                </span>
                              </div>
                              <a
                                href={submission.url}
                                target="_blank"
                                className="p-3 bg-emerald-500/10 rounded-xl hover:scale-110 transition-transform"
                              >
                                <ExternalLink className="w-5 h-5 text-emerald-400" />
                              </a>
                            </div>
                            <Button
                              disabled
                              className="w-full h-14 rounded-2xl bg-zinc-800 text-zinc-500 font-black uppercase tracking-widest opacity-50"
                            >
                              DEPLOYED SUCCESSFULLY
                            </Button>
                          </div>
                        ) : (
                          <Dialog
                            open={isSubmitOpen}
                            onOpenChange={setIsSubmitOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                onClick={() =>
                                  setSelectedAssignment(assignment)
                                }
                                disabled={past}
                                className="w-full h-15 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] cursor-pointer shadow-[0_15px_30px_rgba(124,58,237,0.4)] transition-all"
                              >
                                {past
                                  ? "TRANSMISSION CLOSED"
                                  : "Initialize Submission"}
                              </Button>
                            </DialogTrigger>

                            <DialogContent className={modalClass}>
                              <DialogHeader className="p-8 pb-4">
                                <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                                  <div className="w-3 h-8 bg-violet-600 rounded-full" />
                                  Secure Upload
                                </DialogTitle>
                              </DialogHeader>

                              <form
                                onSubmit={handleSubmit}
                                className="p-8 pt-2 flex flex-col flex-1 gap-6"
                              >
                                {error && (
                                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex gap-3 items-center">
                                    <AlertCircle className="w-5 h-5" />
                                    {error}
                                  </div>
                                )}
                                {success && (
                                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex gap-3 items-center">
                                    <CheckCircle className="w-5 h-5" />
                                    {success}
                                  </div>
                                )}

                                <div className="space-y-2">
                                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                                    Live Deployment URL
                                  </Label>
                                  <Input
                                    className="h-14 bg-white/3 border-white/1 rounded-2xl focus:ring-2 focus:ring-violet-600 outline-none transition-all placeholder:text-zinc-700"
                                    value={form.url}
                                    onChange={(e) =>
                                      setForm({ ...form, url: e.target.value })
                                    }
                                    placeholder="https://your-mission.vercel.app"
                                    required
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                                    Implementation Notes
                                  </Label>
                                  <Textarea
                                    className="min-h-37.5 bg-white/3 border-white/1 rounded-2xl resize-none outline-none focus:ring-2 focus:ring-violet-600 transition-all p-4 placeholder:text-zinc-700"
                                    value={form.note}
                                    onChange={(e) =>
                                      setForm({ ...form, note: e.target.value })
                                    }
                                    placeholder="Describe your methodology..."
                                    required
                                  />
                                </div>

                                <div className="flex gap-4 pt-4">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsSubmitOpen(false)}
                                    className="h-14 px-8 rounded-2xl border border-white/8 text-zinc-400 font-bold uppercase text-[10px] tracking-widest cursor-pointer"
                                  >
                                    Abort
                                  </Button>
                                  <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 h-14 bg-violet-600 hover:bg-violet-500 rounded-2xl font-black uppercase tracking-[0.2em] cursor-pointer shadow-lg shadow-violet-600/30"
                                  >
                                    {loading
                                      ? "TRANSMITTING..."
                                      : "CONFIRM DEPLOY"}
                                  </Button>
                                </div>
                              </form>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Futuristic Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-16">
          <Button
            variant="ghost"
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((p) => p - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="h-12 w-12 rounded-2xl bg-zinc-900 border border-white/8 cursor-pointer hover:bg-violet-600 hover:text-white transition-all shadow-xl"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3 p-2 bg-zinc-900/50 border border-white/8 rounded-3xl backdrop-blur-md">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentPage(i + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`h-10 w-10 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  currentPage === i + 1
                    ? "bg-violet-600 text-white shadow-lg"
                    : "text-zinc-600 hover:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <Button
            variant="ghost"
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((p) => p + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="h-12 w-12 rounded-2xl bg-zinc-900 border border-white/8 cursor-pointer hover:bg-violet-600 hover:text-white transition-all shadow-xl"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
