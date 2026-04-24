import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongoose";
import Assignment from "@/lib/models/Assignment";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const assignments = await Assignment.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    return NextResponse.json(assignments);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, deadline, difficulty } = await req.json();
    await connectDB();

    const assignment = await Assignment.create({
      title,
      description,
      deadline,
      difficulty,
      createdBy: (session.user as any).id,
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
