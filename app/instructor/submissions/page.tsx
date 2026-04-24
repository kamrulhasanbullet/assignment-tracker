import { connectDB } from "@/lib/mongoose";
import Submission from "@/lib/models/Submission";
import InstructorSubmissionsClient from "./InstructorSubmissionsClient";


export default async function InstructorSubmissionsPage() {
  await connectDB();

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
