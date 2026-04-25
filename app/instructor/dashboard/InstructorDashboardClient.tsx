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
import {
  CheckCircle2,
  Clock,
  RotateCcw,
  BarChart3,
  TrendingUp,
} from "lucide-react";

const STATUS_COLORS = {
  pending: "#8b5cf6", 
  accepted: "#10b981", 
  needs_improvement: "#f43f5e", 
};

export default function InstructorDashboardClient({
  initialSubmissions,
}: {
  initialSubmissions: any[];
}) {
  const submissions = initialSubmissions;

  const { statusData, difficultyData, stats } = useMemo(() => {
    const statusData = ["pending", "accepted", "needs_improvement"]
      .map((s) => ({
        name:
          s === "needs_improvement"
            ? "Action Needed"
            : s.charAt(0).toUpperCase() + s.slice(1),
        value: submissions.filter((sub) => sub.status === s).length,
        color: STATUS_COLORS[s as keyof typeof STATUS_COLORS],
      }))
      .filter((d) => d.value > 0);

    const difficultyData = ["beginner", "intermediate", "advanced"].map(
      (d) => ({
        difficulty: d.charAt(0).toUpperCase() + d.slice(1),
        total: submissions.filter((sub) => sub.assignmentId?.difficulty === d)
          .length,
        accepted: submissions.filter(
          (sub) =>
            sub.assignmentId?.difficulty === d && sub.status === "accepted",
        ).length,
      }),
    );

    const stats = [
      {
        label: "Total Submissions",
        value: submissions.length,
        icon: BarChart3,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
      },
      {
        label: "Accepted",
        value: submissions.filter((s) => s.status === "accepted").length,
        icon: CheckCircle2,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
      },
      {
        label: "Pending Review",
        value: submissions.filter((s) => s.status === "pending").length,
        icon: Clock,
        color: "text-violet-400",
        bg: "bg-violet-500/10",
      },
      {
        label: "Revision Required",
        value: submissions.filter((s) => s.status === "needs_improvement")
          .length,
        icon: RotateCcw,
        color: "text-rose-400",
        bg: "bg-rose-500/10",
      },
    ];

    return { statusData, difficultyData, stats };
  }, [submissions]);

  return (
    <div className="max-w-350 mx-auto px-4 py-10 space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-violet-500 font-black text-[10px] uppercase tracking-[0.3em]">
            <TrendingUp size={14} /> Global Performance
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
            Intelligence{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-fuchsia-500">
              Center
            </span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">
            Real-time metrics for student mission deployments.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="bg-[#0f0f18]/60 border-white/8 rounded-[28px] overflow-hidden backdrop-blur-xl group hover:border-white/20 transition-all"
          >
            <CardContent className="p-6 relative">
              <div
                className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`}
              />
              <div
                className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-4`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-3xl font-black text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Status Breakdown - Pie Chart (Col-span 2) */}
        <Card className="lg:col-span-2 bg-[#0f0f18]/60 border-white/8 rounded-[32px] backdrop-blur-xl overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">
              Deployment Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            {statusData.length === 0 ? (
              <div className="h-75 flex items-center justify-center text-zinc-600 text-xs font-bold uppercase">
                No data received
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f0f18",
                      borderRadius: "16px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: "12px",
                      fontWeight: "900",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      paddingTop: "20px",
                      fontSize: "10px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Difficulty Breakdown - Bar Chart (Col-span 3) */}
        <Card className="lg:col-span-3 bg-[#0f0f18]/60 border-white/8 rounded-[32px] backdrop-blur-xl overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">
              Missions by Tier
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={difficultyData} barGap={12}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.03)"
                />
                <XAxis
                  dataKey="difficulty"
                  stroke="#52525b"
                  fontSize={10}
                  fontWeight={900}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => val.toUpperCase()}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  contentStyle={{
                    backgroundColor: "#0f0f18",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontSize: "12px",
                    fontWeight: "900",
                  }}
                />
                <Bar
                  dataKey="total"
                  fill="rgba(255,255,255,5)"
                  name="Total Units"
                  radius={[10, 10, 10, 10]}
                  barSize={32}
                  className="focus:outline-none outline-none"
                />
                <Bar
                  dataKey="accepted"
                  fill="#8b5cf6"
                  name="Success Rate"
                  radius={[10, 10, 10, 10]}
                  barSize={32}
                  className="focus:outline-none outline-none"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insight Footer */}
      <div className="p-8 rounded-[32px] bg-linear-to-r from-violet-600/10 to-transparent border border-violet-500/20 flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-violet-600/20 flex items-center justify-center shrink-0">
          <BarChart3 className="text-violet-400 w-8 h-8" />
        </div>
        <div>
          <h4 className="text-white font-bold text-lg leading-tight uppercase tracking-tight">
            Mission Success Insight
          </h4>
          <p className="text-zinc-500 text-sm mt-1 max-w-2xl">
            Currently tracking{" "}
            <span className="text-white font-bold">{submissions.length}</span>{" "}
            active missions. The success rate is approximately{" "}
            <span className="text-emerald-400 font-bold">
              {submissions.length
                ? (
                    (submissions.filter((s) => s.status === "accepted").length /
                      submissions.length) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </span>{" "}
            across all difficulty levels.
          </p>
        </div>
      </div>
    </div>
  );
}
