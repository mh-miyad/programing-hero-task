/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { title, description, supportArguments, opposeArguments } =
      await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Please summarize the following debate. Provide a concise overview, highlighting the main points from both the support and oppose sides. Conclude with a neutral summary of the debate's overall direction or outcome if discernible.

Debate Title: ${title}
Debate Description: ${description}

Support Arguments:\n${supportArguments
      .map((arg: string) => `- ${arg}`)
      .join("\n")}

Oppose Arguments:\n${opposeArguments
      .map((arg: string) => `- ${arg}`)
      .join("\n")}

Summary:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("Error summarizing debate:", error);
    return NextResponse.json(
      { error: "Failed to generate summary", details: error.message },
      { status: 500 }
    );
  }
}
