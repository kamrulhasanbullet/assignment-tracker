import { connectDB } from "@/lib/mongoose";
import Submission from "@/lib/models/Submission";
import InstructorDashboardClient from "./InstructorDashboardClient";
import Assignment from "@/lib/models/Assignment";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function InstructorDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await connectDB();

  void Assignment;
  void User;

  const submissions = await Submission.find()
    .populate({
      path: "assignmentId",
      match: { createdBy: (session.user as any).id },
    })
    .lean();

  const filtered = submissions.filter((s) => s.assignmentId !== null);

  return (
    <InstructorDashboardClient
      initialSubmissions={JSON.parse(JSON.stringify(filtered))}
    />
  );
}
