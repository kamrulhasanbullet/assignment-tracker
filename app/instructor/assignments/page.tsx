import { connectDB } from "@/lib/mongoose";
import Assignment from "@/lib/models/Assignment";
import AssignmentsClient from "./AssignmentsClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function InstructorAssignments() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await connectDB();

  const assignments = await Assignment.find({
    createdBy: (session.user as any).id,
  })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <AssignmentsClient
      initialAssignments={JSON.parse(JSON.stringify(assignments))}
    />
  );
}
