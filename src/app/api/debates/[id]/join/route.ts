/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from "@/database/db.config";
import Debate from "@/database/models/Debate";
import { NextRequest, NextResponse } from "next/server";
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  try {
    const { id } = params;
    const { userId, side } = await req.json(); // userId is email

    const debate = await Debate.findById(id);
    if (!debate) {
      return NextResponse.json(
        { message: "Debate not found" },
        { status: 404 }
      );
    }

    if (!debate.isActive) {
      return NextResponse.json(
        { message: "Debate has ended" },
        { status: 400 }
      );
    }

    const existingParticipant = debate.participants.find(
      (p: any) => p.userId === userId
    );
    if (existingParticipant) {
      return NextResponse.json(
        { message: "User already joined this debate" },
        { status: 400 }
      );
    }

    debate.participants.push({ userId, side, joinedAt: new Date() });
    await debate.save();

    return NextResponse.json(debate, { status: 200 });
  } catch (error) {
    console.error("Error joining debate:", error);
    return NextResponse.json(
      { message: "Error joining debate" },
      { status: 500 }
    );
  }
}
