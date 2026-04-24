import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { studentNote, assignmentTitle, difficulty, status } =
      await req.json();

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const feedbackMap: Record<string, string> = {
      accepted: `Great work on "${assignmentTitle}"! Your submission demonstrates a solid understanding of ${difficulty}-level concepts. ${studentNote ? `Your note "${studentNote}" shows thoughtful approach.` : ""} Keep up the excellent work and continue building on these foundations.`,
      needs_improvement: `Thank you for submitting "${assignmentTitle}". While you've made a start, there are areas that need attention for this ${difficulty}-level task. ${studentNote ? `Regarding your note: "${studentNote}" — please revisit the core requirements.` : ""} Review the assignment guidelines and resubmit with the necessary improvements.`,
      pending: `Your submission for "${assignmentTitle}" is currently under review. This is a ${difficulty}-level assignment and initial observations look promising. ${studentNote ? `Your note "${studentNote}" has been noted.` : ""} Detailed feedback will follow shortly.`,
    };

    const feedback = feedbackMap[status] ?? feedbackMap["pending"];
    return NextResponse.json({ feedback });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "AI error" },
      { status: 500 },
    );
  }
}
