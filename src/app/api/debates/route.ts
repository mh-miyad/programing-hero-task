import { connectDB } from "@/database/db.config";
import Debate from "@/database/models/Debate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const debates = await Debate.find().sort({ createdAt: -1 });
    return NextResponse.json(debates, { status: 200 });
  } catch (error) {
    console.error("Error fetching debates:", error);
    return NextResponse.json(
      { message: "Error fetching debates" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, description, tags, category, banner, duration, createdBy } =
      body;

    if (!title || !description || !category || !duration || !createdBy) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const endTime = new Date(Date.now() + duration * 60 * 60 * 1000);

    const newDebate = new Debate({
      title,
      description,
      tags: tags || [],
      category,
      banner: banner || "/placeholder.svg?height=200&width=400",
      duration,
      endTime,
      createdAt: new Date(),
      createdBy, // Email string
      participants: [],
      arguments: [],
      supportVotes: 0,
      opposeVotes: 0,
      totalVotes: 0,
      isActive: true,
      winner: null,
    });

    await newDebate.save();
    return NextResponse.json(newDebate, { status: 201 });
  } catch (error) {
    console.error("Error creating debate:", error);
    return NextResponse.json(
      { message: "Error creating debate" },
      { status: 500 }
    );
  }
}
