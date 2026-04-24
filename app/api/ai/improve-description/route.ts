import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, difficulty } = await req.json();

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const improved = `[${difficulty.toUpperCase()} LEVEL] ${description.trim()}

Objectives:
- Understand and implement the core concepts related to "${title}"
- Follow best practices and write clean, readable code
- Document your approach and any challenges faced

Submission Requirements:
- Provide a working implementation with clear structure
- Include a brief note explaining your solution
- Submit your project URL with all necessary files

Evaluation Criteria:
- Code quality and organization
- Correctness of implementation
- Clarity of documentation`;

    return NextResponse.json({ improved });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "AI error" },
      { status: 500 },
    );
  }
}
