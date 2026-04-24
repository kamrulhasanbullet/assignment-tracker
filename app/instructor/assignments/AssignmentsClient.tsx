"use client";
import { useState } from "react";
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
} from "@/components/ui/dialog";

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  advanced: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function AssignmentsClient({
  initialAssignments,
}: {
  initialAssignments: any[];
}) {
  const [assignments, setAssignments] = useState<any[]>(initialAssignments);
  const [open, setOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    difficulty: "beginner",
  });

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

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this assignment?")) return;
    await fetch(`/api/assignments/${id}`, { method: "DELETE" });
    fetchAssignments();
  };

  const handleImproveDescription = async () => {
    if (!form.title || !form.description) return;
    setAiLoading(true);
    const res = await fetch("/api/ai/improve-description", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        difficulty: form.difficulty,
      }),
    });
    const data = await res.json();
    if (data.improved) {
      setForm((prev) => ({ ...prev, description: data.improved }));
    }
    setAiLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Assignments</h1>
          <p className="text-slate-400 mt-1">
            Create and manage course assignments
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              + New Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">
                Create Assignment
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Build a REST API..."
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Description</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleImproveDescription}
                    disabled={aiLoading || !form.title || !form.description}
                    className="text-purple-400 hover:text-purple-300 text-xs"
                  >
                    {aiLoading ? "✨ Improving..." : "✨ AI Improve"}
                  </Button>
                </div>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe the assignment requirements..."
                  className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Deadline</Label>
                <Input
                  type="date"
                  value={form.deadline}
                  onChange={(e) =>
                    setForm({ ...form, deadline: e.target.value })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Difficulty</Label>
                <Select
                  value={form.difficulty}
                  onValueChange={(v) => setForm({ ...form, difficulty: v })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-white">
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Assignment"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map((assignment) => (
          <Card key={assignment._id} className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-white text-lg leading-tight">
                  {assignment.title}
                </CardTitle>
                <Badge
                  className={`text-xs capitalize shrink-0 ${difficultyColors[assignment.difficulty]}`}
                >
                  {assignment.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-slate-400 text-sm line-clamp-3">
                {assignment.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  📅 {new Date(assignment.deadline).toLocaleDateString()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(assignment._id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 px-2"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {assignments.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-4">📝</div>
          <p>No assignments yet. Create your first one!</p>
        </div>
      )}
    </div>
  );
}
