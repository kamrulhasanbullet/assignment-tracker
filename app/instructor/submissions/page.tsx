"use client";
import { useEffect, useState } from "react";
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

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  accepted: "bg-green-500/20 text-green-400",
  needs_improvement: "bg-red-500/20 text-red-400",
};

export default function InstructorSubmissions() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [editing, setEditing] = useState<
    Record<string, { status: string; feedback: string }>
  >({});
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    const res = await fetch("/api/submissions");
    const data = await res.json();
    setSubmissions(data);
    setLoading(false);

    // Initialize editing state
    const init: Record<string, { status: string; feedback: string }> = {};
    data.forEach((s: any) => {
      init[s._id] = { status: s.status, feedback: s.feedback || "" };
    });
    setEditing(init);
  };

  const handleUpdate = async (id: string) => {
    await fetch(`/api/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing[id]),
    });
    fetchSubmissions();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Student Submissions</h1>
        <p className="text-slate-400 mt-1">
          Review and provide feedback on all submissions
        </p>
      </div>

      <div className="space-y-4">
        {submissions.map((sub) => (
          <Card key={sub._id} className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-white text-lg">
                    {sub.assignmentId?.title || "Unknown Assignment"}
                  </CardTitle>
                  <p className="text-slate-400 text-sm mt-1">
                    👤 {sub.studentId?.name || "Unknown Student"} •{" "}
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={`capitalize ${statusColors[sub.status]}`}>
                  {sub.status.replace("_", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">Student Note:</p>
                <p className="text-slate-300 text-sm">{sub.note}</p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">Submission URL:</p>
                <a
                  href={sub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 text-sm hover:underline break-all"
                >
                  {sub.url}
                </a>
              </div>

              {editing[sub._id] && (
                <div className="space-y-3 pt-2 border-t border-slate-700">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1 space-y-1">
                      <label className="text-slate-400 text-xs">
                        Update Status
                      </label>
                      <Select
                        value={editing[sub._id].status}
                        onValueChange={(v) =>
                          setEditing((prev) => ({
                            ...prev,
                            [sub._id]: { ...prev[sub._id], status: v },
                          }))
                        }
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600 text-white">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="needs_improvement">
                            Needs Improvement
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-400 text-xs">Feedback</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAIFeedback(sub)}
                        disabled={aiLoading === sub._id}
                        className="text-purple-400 hover:text-purple-300 text-xs h-6 px-2"
                      >
                        {aiLoading === sub._id
                          ? "✨ Generating..."
                          : "✨ AI Generate"}
                      </Button>
                    </div>
                    <Textarea
                      value={editing[sub._id].feedback}
                      onChange={(e) =>
                        setEditing((prev) => ({
                          ...prev,
                          [sub._id]: {
                            ...prev[sub._id],
                            feedback: e.target.value,
                          },
                        }))
                      }
                      placeholder="Write feedback for the student..."
                      className="bg-slate-700 border-slate-600 text-white min-h-[80px] text-sm"
                    />
                  </div>

                  <Button
                    onClick={() => handleUpdate(sub._id)}
                    className="bg-purple-600 hover:bg-purple-700 h-8 text-sm"
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {submissions.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-4">📬</div>
          <p>No submissions yet.</p>
        </div>
      )}
    </div>
  );
}
