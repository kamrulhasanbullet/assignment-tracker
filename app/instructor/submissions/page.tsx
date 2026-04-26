import { connectDB } from "@/lib/mongoose";
import Submission from "@/lib/models/Submission";
import InstructorSubmissionsClient from "./InstructorSubmissionsClient";
import Assignment from "@/lib/models/Assignment";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function InstructorSubmissionsPage() {
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
    .populate("studentId")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  const filtered = submissions.filter((s) => s.assignmentId !== null);

  return (
    <InstructorSubmissionsClient
      initialSubmissions={JSON.parse(JSON.stringify(filtered))}
    />
  );
}
