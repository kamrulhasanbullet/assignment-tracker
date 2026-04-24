import { connectDB } from "@/lib/mongoose";
import Submission from "@/lib/models/Submission";
import InstructorDashboardClient from "./InstructorDashboardClient";
import Assignment from "@/lib/models/Assignment";
import User from "@/lib/models/User";

export default async function InstructorDashboardPage() {
  await connectDB();

  void Assignment;
  void User;

  const submissions = await Submission.find().populate("assignmentId").lean();

  return (
    <InstructorDashboardClient
      initialSubmissions={JSON.parse(JSON.stringify(submissions))}
    />
  );
}
