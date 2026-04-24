"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  { color: string; icon: string; label: string }
> = {
  pending: {
    color: "bg-yellow-500/20 text-yellow-400",
    icon: "⏳",
    label: "Pending",
  },
  accepted: {
    color: "bg-green-500/20 text-green-400",
    icon: "✅",
    label: "Accepted",
  },
  needs_improvement: {
    color: "bg-red-500/20 text-red-400",
    icon: "🔄",
    label: "Needs Improvement",
  },
};

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/20 text-green-400",
  intermediate: "bg-yellow-500/20 text-yellow-400",
  advanced: "bg-red-500/20 text-red-400",
};

export default function StudentSubmissionsClient({
  submissions,
}: {
  submissions: Submission[];
}) {
  const [data] = useState<Submission[]>(submissions);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">My Submissions</h1>
        <p className="text-slate-400 mt-1">
          Track your progress and view instructor feedback
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => (
          <Card key={status} className="bg-slate-800 border-slate-700">
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl mb-1">{config.icon}</div>
              <div className="text-xl font-bold text-white">
                {data.filter((s) => s.status === status).length}
              </div>
              <div className="text-slate-400 text-xs">{config.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {data.map((sub) => {
          const statusInfo =
            statusConfig[sub.status] || statusConfig["pending"];

          return (
            <Card key={sub._id} className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-white text-lg">
                      {sub.assignmentId?.title || "Assignment"}
                    </CardTitle>
                    <p className="text-slate-500 text-sm mt-0.5">
                      Submitted {new Date(sub.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {sub.assignmentId?.difficulty && (
                      <Badge
                        className={`text-xs capitalize ${
                          difficultyColors[sub.assignmentId.difficulty]
                        }`}
                      >
                        {sub.assignmentId.difficulty}
                      </Badge>
                    )}

                    <Badge className={`capitalize ${statusInfo.color}`}>
                      {statusInfo.icon} {statusInfo.label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Your Note:</p>
                  <p className="text-slate-300 text-sm">{sub.note}</p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Submitted URL:</p>
                  <a
                    href={sub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 text-sm hover:underline break-all"
                  >
                    {sub.url}
                  </a>
                </div>

                {sub.feedback ? (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                    <p className="text-xs text-purple-400 mb-1">
                      💬 Instructor Feedback:
                    </p>
                    <p className="text-slate-300 text-sm">{sub.feedback}</p>
                  </div>
                ) : sub.status === "pending" ? (
                  <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-3">
                    <p className="text-slate-500 text-sm text-center">
                      ⏳ Awaiting instructor feedback...
                    </p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {data.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-4">📬</div>
          <p>No submissions yet. Go submit your first assignment!</p>
        </div>
      )}
    </div>
  );
}
