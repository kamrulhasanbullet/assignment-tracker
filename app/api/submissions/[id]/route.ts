import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongoose";
import Submission from "@/lib/models/Submission";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status, feedback } = await req.json();
    await connectDB();

    const submission = await Submission.findByIdAndUpdate(
      id,
      { status, feedback },
      { returnDocument: "after" },
    );

    return NextResponse.json(submission);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
