import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import Assignment from "@/lib/models/Assignment";
import Submission from "@/lib/models/Submission";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const assignment = await Assignment.findById(id);

    if (!assignment) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (assignment.createdBy.toString() !== (session.user as any).id) {
      return NextResponse.json(
        { error: "You can only delete your own assignments" },
        { status: 403 },
      );
    }

    await Assignment.findByIdAndDelete(id);
    await Submission.deleteMany({ assignmentId: id });

    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
