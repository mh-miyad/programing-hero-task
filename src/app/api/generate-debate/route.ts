import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json(
      { message: "API key not configured for AI content generation." },
      { status: 500 }
    );
  }

  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { message: "Topic is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `Create a debate topic and a detailed description for the following topic: \"${topic}\". Return the response as a JSON object with two properties: "title" and "description".`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text(); // Await the text() method

    try {
      const generatedContent = JSON.parse(text);
      return NextResponse.json(generatedContent, { status: 200 });
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON:", text);
      return NextResponse.json(
        { message: "Failed to parse AI-generated content. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in generate-debate API:", error);
    return NextResponse.json(
      { message: "Error generating debate content" },
      { status: 500 }
    );
  }
}
