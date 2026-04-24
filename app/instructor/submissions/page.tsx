import { connectDB } from "@/lib/mongoose";
import Submission from "@/lib/models/Submission";
import InstructorSubmissionsClient from "./InstructorSubmissionsClient";
import Assignment from "@/lib/models/Assignment";
import User from "@/lib/models/User";

export default async function InstructorSubmissionsPage() {
  await connectDB();

  void Assignment;
  void User;

  const submissions = await Submission.find()
    .populate("assignmentId")
    .populate("studentId")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return (
    <InstructorSubmissionsClient
      initialSubmissions={JSON.parse(JSON.stringify(submissions))}
    />
  );
}
