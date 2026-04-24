import { connectDB } from "@/lib/mongoose";
import Assignment from "@/lib/models/Assignment";
import StudentAssignmentsClient from "./StudentAssignmentsClient";


export default async function StudentAssignmentsPage() {
  await connectDB();

  const assignments = await Assignment.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return (
    <StudentAssignmentsClient
      initialAssignments={JSON.parse(JSON.stringify(assignments))}
    />
  );
}
