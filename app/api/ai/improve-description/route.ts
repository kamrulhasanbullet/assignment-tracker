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

    const { title, description, difficulty } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert curriculum designer for programming courses. Improve assignment descriptions to be clearer, more engaging, and include specific requirements. Keep it under 200 words.`,
        },
        {
          role: "user",
          content: `Assignment Title: "${title}"
                    Difficulty: ${difficulty}
                    Current Description: "${description}"

                    Improve this assignment description to be clearer and more structured.`,
        },
      ],
      max_tokens: 300,
    });

    const improved = completion.choices[0].message.content;
    return NextResponse.json({ improved });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "AI error" },
      { status: 500 },
    );
  }
}
