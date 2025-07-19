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
    const { argumentId, userId } = await req.json(); // userId is email

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

    const argument = debate.arguments.find(
      (a: any) => a._id.toString() === argumentId
    );
    if (!argument) {
      return NextResponse.json(
        { message: "Argument not found" },
        { status: 404 }
      );
    }

    if (argument.votedBy.includes(userId)) {
      return NextResponse.json(
        { message: "User already voted on this argument" },
        { status: 400 }
      );
    }

    argument.votes += 1;
    argument.votedBy.push(userId);

    // Update vote counts
    debate.supportVotes = debate.arguments
      .filter((a: any) => a.side === "support")
      .reduce((sum: number, a: any) => sum + a.votes, 0);
    debate.opposeVotes = debate.arguments
      .filter((a: any) => a.side === "oppose")
      .reduce((sum: number, a: any) => sum + a.votes, 0);
    debate.totalVotes = debate.supportVotes + debate.opposeVotes;

    await debate.save();
    return NextResponse.json(debate, { status: 200 });
  } catch (error) {
    console.error("Error voting on argument:", error);
    return NextResponse.json(
      { message: "Error voting on argument" },
      { status: 500 }
    );
  }
}
