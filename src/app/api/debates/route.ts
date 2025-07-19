import { connectDB } from "@/database/db.config";
import Debate from "@/database/models/Debate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const debates = await Debate.find().sort({ createdAt: -1 });
    return NextResponse.json(debates, { status: 200 });
  } catch (error) {
    console.error(error);
  }
}
export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();
    const newDebate = new Debate({
      ...body,
      createdAt: new Date(),
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
    console.error(error);
    return NextResponse.json(
      { message: "Error creating debate" },
      { status: 500 }
    );
  }
}
