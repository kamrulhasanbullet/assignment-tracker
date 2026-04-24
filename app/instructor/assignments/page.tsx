import { connectDB } from "@/lib/mongoose";
import Assignment from "@/lib/models/Assignment";
import AssignmentsClient from "./AssignmentsClient";

export default async function InstructorAssignments() {
  await connectDB();
  const assignments = await Assignment.find().sort({ createdAt: -1 }).lean();

  return (
    <AssignmentsClient
      initialAssignments={JSON.parse(JSON.stringify(assignments))}
    />
  );
}
