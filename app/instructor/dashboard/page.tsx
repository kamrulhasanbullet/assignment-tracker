import { connectDB } from "@/lib/mongoose";
import Submission from "@/lib/models/Submission";
import InstructorDashboardClient from "./InstructorDashboardClient";


export default async function InstructorDashboardPage() {
  await connectDB();

  const submissions = await Submission.find()
    .populate("assignmentId") // important
    .lean();

  return (
    <InstructorDashboardClient
      initialSubmissions={JSON.parse(JSON.stringify(submissions))}
    />
  );
}
