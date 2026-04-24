"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [form, setForm] = useState({ url: "", note: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/assignments")
      .then((r) => r.json())
      .then(setAssignments);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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

    if (!res.ok) {
      setError(data.error || "Submission failed");
    } else {
      setSuccess("Submitted successfully!");
      setForm({ url: "", note: "" });
      setTimeout(() => {
        setSelectedAssignment(null);
        setSuccess("");
      }, 1500);
    }
    setLoading(false);
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Available Assignments</h1>
        <p className="text-slate-400 mt-1">Browse and submit your work</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map((assignment) => {
          const passed = isDeadlinePassed(assignment.deadline);
          return (
            <Card
              key={assignment._id}
              className="bg-slate-800 border-slate-700"
            >
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
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${passed ? "text-red-400" : "text-slate-400"}`}
                  >
                    📅 {new Date(assignment.deadline).toLocaleDateString()}
                    {passed && " (Expired)"}
                  </span>
                </div>

                <Dialog
                  open={selectedAssignment?._id === assignment._id}
                  onOpenChange={(open) => {
                    if (!open) {
                      setSelectedAssignment(null);
                      setError("");
                      setSuccess("");
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={passed}
                      onClick={() => setSelectedAssignment(assignment)}
                    >
                      {passed ? "Deadline Passed" : "Submit Assignment"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-700 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        Submit: {assignment.title}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm">
                          {error}
                        </div>
                      )}
                      {success && (
                        <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-2 rounded-lg text-sm">
                          {success}
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label className="text-slate-300">
                          GitHub/Live URL
                        </Label>
                        <Input
                          type="url"
                          value={form.url}
                          onChange={(e) =>
                            setForm({ ...form, url: e.target.value })
                          }
                          placeholder="https://github.com/..."
                          className="bg-slate-700 border-slate-600 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Note</Label>
                        <Textarea
                          value={form.note}
                          onChange={(e) =>
                            setForm({ ...form, note: e.target.value })
                          }
                          placeholder="Describe your implementation, challenges faced..."
                          className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Submit"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {assignments.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-4">📚</div>
          <p>No assignments available yet.</p>
        </div>
      )}
    </div>
  );
}
