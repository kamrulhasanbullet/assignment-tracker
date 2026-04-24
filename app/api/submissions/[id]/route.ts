import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongoose";
import Submission from "@/lib/models/Submission";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status, feedback } = await req.json();
    await connectDB();

    const submission = await Submission.findByIdAndUpdate(
      params.id,
      { status, feedback },
      { new: true },
    );

    return NextResponse.json(submission);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
