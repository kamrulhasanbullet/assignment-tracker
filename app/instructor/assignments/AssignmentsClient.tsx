"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Calendar,
  Terminal,
  Inbox,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const difficultyColors: Record<string, string> = {
  beginner: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
  intermediate: "border-amber-500/50 bg-amber-500/10 text-amber-400",
  advanced: "border-rose-500/50 bg-rose-500/10 text-rose-400",
};

export default function AssignmentsClient({
  initialAssignments,
}: {
  initialAssignments: any[];
}) {
  const [assignments, setAssignments] = useState<any[]>(initialAssignments);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    difficulty: "beginner",
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(assignments.length / itemsPerPage);
  const currentItems = assignments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const fetchAssignments = async () => {
    const res = await fetch("/api/assignments");
    const data = await res.json();
    setAssignments(data);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({
      title: "",
      description: "",
      deadline: "",
      difficulty: "beginner",
    });
    setOpen(false);
    setLoading(false);
    fetchAssignments();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/assignments/${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    fetchAssignments();
  };

  const handleImproveDescription = async () => {
    if (!form.title || !form.description) return;
    setAiLoading(true);
    const res = await fetch("/api/ai/improve-description", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.improved)
      setForm((prev) => ({ ...prev, description: data.improved }));
    setAiLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-10 px-6 selection:bg-violet-500/30">
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-violet-400 font-bold text-[11px] uppercase tracking-[0.4em]">
            <Terminal size={14} className="animate-pulse" /> Command Center
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none overflow-visible py-2">
            Missions{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-fuchsia-500 pr-4">
              Board
            </span>
          </h1>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="h-14 px-8 bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_30px_rgba(139,92,246,0.2)]">
              <Plus className="mr-2 w-5 h-5" /> New Deployment
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0c0c14] border-white/10 text-white max-w-xl rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
            <div className="p-8 space-y-8">
              <DialogHeader>
                <DialogTitle className="text-3xl font-black uppercase italic tracking-tight flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                    <Plus className="text-violet-400" />
                  </div>
                  New Mission
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                      Mission Title
                    </Label>
                    <Input
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      className="bg-white/5 border-white/10 h-14 rounded-xl focus:border-violet-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        Intelligence Brief
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleImproveDescription}
                        disabled={aiLoading}
                        className="text-fuchsia-400 hover:text-fuchsia-300 text-[10px] font-black uppercase p-0 h-auto"
                      >
                        {aiLoading ? (
                          <Loader2 className="animate-spin w-3 h-3" />
                        ) : (
                          "✨ AI Forge"
                        )}
                      </Button>
                    </div>
                    <Textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="bg-white/5 border-white/10 min-h-35 rounded-2xl resize-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                        Deadline
                      </Label>
                      <Input
                        type="date"
                        value={form.deadline}
                        onChange={(e) =>
                          setForm({ ...form, deadline: e.target.value })
                        }
                        className="bg-white/5 border-white/10 h-14 rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                        Threat Level
                      </Label>
                      <Select
                        value={form.difficulty}
                        onValueChange={(v) =>
                          setForm({ ...form, difficulty: v })
                        }
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-xl focus:ring-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-zinc-500 hover:text-white"
                    >
                      Abort
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="flex-2 h-14 bg-violet-600 hover:bg-violet-500 rounded-2xl font-black uppercase tracking-widest"
                  >
                    {loading ? "Uploading..." : "Confirm Deployment"}
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      {/* --- GRID & CARDS --- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {currentItems.map((assignment, idx) => (
            <motion.div
              key={assignment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="group relative bg-white/2 border-white/5 rounded-[32px] overflow-hidden backdrop-blur-md transition-all hover:bg-white/4 hover:border-violet-500/30">
                <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${difficultyColors[assignment.difficulty]}`}
                    >
                      {assignment.difficulty}
                    </Badge>
                    <button
                      onClick={() => setDeleteId(assignment._id)}
                      className="text-zinc-600 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-white group-hover:text-violet-400 transition-colors leading-tight line-clamp-1 italic uppercase">
                      {assignment.title}
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 font-medium">
                      {assignment.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                      <Calendar size={14} className="text-violet-500" />
                      {new Date(assignment.deadline).toLocaleDateString()}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={16} className="text-violet-400" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* --- PAGINATION --- */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="bg-transparent border-white/10 rounded-xl hover:bg-white/5"
          >
            <ChevronLeft size={18} />
          </Button>
          <div className="px-6 py-2 bg-white/5 rounded-xl border border-white/10 text-[11px] font-black uppercase tracking-widest text-zinc-400">
            Sector <span className="text-white">{currentPage}</span> /{" "}
            {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="bg-transparent border-white/10 rounded-xl hover:bg-white/5"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent className="bg-[#0c0c14] border-rose-500/20 text-white max-w-sm rounded-[2rem] p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-rose-500" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tight text-center">
              Terminate Mission?
            </DialogTitle>
          </DialogHeader>
          <p className="text-zinc-500 text-sm font-medium mt-2">
            This action is irreversible. All data for this deployment will be
            purged from the system.
          </p>
          <div className="flex gap-3 mt-8">
            <Button
              variant="ghost"
              onClick={() => setDeleteId(null)}
              className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest"
            >
              Abort
            </Button>
            <Button
              onClick={confirmDelete}
              className="flex-1 h-12 bg-rose-600 hover:bg-rose-500 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-rose-500/20"
            >
              Purge
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- EMPTY STATE --- */}
      {assignments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-white/5 rounded-[40px] bg-white/1">
          <Inbox size={60} className="text-zinc-800 mb-4" strokeWidth={1} />
          <h3 className="text-zinc-500 font-black uppercase tracking-widest text-xs">
            Awaiting Initial Deployment
          </h3>
        </div>
      )}
    </div>
  );
}
