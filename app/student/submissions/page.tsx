import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongoose";
import Submission from "@/lib/models/Submission";
import StudentSubmissionsClient from "./StudentSubmissionsClient";
import { redirect } from "next/navigation";

async function getSubmissions(studentId: string) {
  await connectDB();
  const submissions = await Submission.find({ studentId })
    .populate("assignmentId", "title difficulty deadline")
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(submissions));
}

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const submissions = await getSubmissions((session.user as any).id);

  return <StudentSubmissionsClient submissions={submissions} />;
}
