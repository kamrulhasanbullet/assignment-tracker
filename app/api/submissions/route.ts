import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongoose";
import Submission from "@/lib/models/Submission";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const filter =
      (session.user as any).role === "student"
        ? { studentId: (session.user as any).id }
        : {};

    const submissions = await Submission.find(filter)
      .populate("assignmentId", "title difficulty deadline")
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(submissions);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { assignmentId, url, note } = await req.json();
    await connectDB();

    // Check duplicate submission
    const existing = await Submission.findOne({
      assignmentId,
      studentId: (session.user as any).id,
    });
    if (existing) {
      return NextResponse.json(
        { error: "Already submitted this assignment" },
        { status: 400 },
      );
    }

    const submission = await Submission.create({
      assignmentId,
      studentId: (session.user as any).id,
      url,
      note,
    });

    return NextResponse.json(submission, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
