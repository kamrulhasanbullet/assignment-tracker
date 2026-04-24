import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { studentNote, assignmentTitle, difficulty } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an experienced programming instructor. Generate constructive, encouraging feedback for a student's assignment submission. Be specific, actionable, and supportive. Keep it under 150 words.`,
        },
        {
          role: "user",
          content: `Assignment: "${assignmentTitle}" (${difficulty} level)
                    Student's note: "${studentNote}"

                    Generate professional feedback for this student.`,
        },
      ],
      max_tokens: 200,
    });

    const feedback = completion.choices[0].message.content;
    return NextResponse.json({ feedback });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "AI error" },
      { status: 500 },
    );
  }
}
