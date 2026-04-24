"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATUS_COLORS = {
  pending: "#f59e0b",
  accepted: "#10b981",
  needs_improvement: "#ef4444",
};

export default function InstructorDashboardClient({
  initialSubmissions,
}: {
  initialSubmissions: any[];
}) {
  const submissions = initialSubmissions;

  // 🔥 Memoized calculations (important for performance)
  const { statusData, difficultyData, stats } = useMemo(() => {
    // Status distribution
    const statusData = ["pending", "accepted", "needs_improvement"]
      .map((s) => ({
        name:
          s === "needs_improvement"
            ? "Needs Improvement"
            : s.charAt(0).toUpperCase() + s.slice(1),
        value: submissions.filter((sub) => sub.status === s).length,
        color: STATUS_COLORS[s as keyof typeof STATUS_COLORS],
      }))
      .filter((d) => d.value > 0);

    // Difficulty distribution
    const difficultyData = ["beginner", "intermediate", "advanced"].map(
      (d) => ({
        difficulty: d.charAt(0).toUpperCase() + d.slice(1),
        submissions: submissions.filter(
          (sub) => sub.assignmentId?.difficulty === d,
        ).length,
        accepted: submissions.filter(
          (sub) =>
            sub.assignmentId?.difficulty === d && sub.status === "accepted",
        ).length,
      }),
    );

    // Stats
    const stats = [
      { label: "Total Submissions", value: submissions.length, icon: "📝" },
      {
        label: "Accepted",
        value: submissions.filter((s) => s.status === "accepted").length,
        icon: "✅",
      },
      {
        label: "Pending Review",
        value: submissions.filter((s) => s.status === "pending").length,
        icon: "⏳",
      },
      {
        label: "Needs Improvement",
        value: submissions.filter((s) => s.status === "needs_improvement")
          .length,
        icon: "🔄",
      },
    ];

    return { statusData, difficultyData, stats };
  }, [submissions]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Track student performance and submission trends
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              Submission Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-slate-400">
                No submissions yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              Submissions by Difficulty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={difficultyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="difficulty" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="submissions"
                  fill="#6366f1"
                  name="Total"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="accepted"
                  fill="#10b981"
                  name="Accepted"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
