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
    const debate = await Debate.findById(id);
    if (!debate) {
      return NextResponse.json(
        { message: "Debate not found" },
        { status: 404 }
      );
    }

    if (!debate.isActive) {
      return NextResponse.json(
        { message: "Debate already closed" },
        { status: 400 }
      );
    }

    debate.isActive = false;
    debate.winner =
      debate.supportVotes > debate.opposeVotes
        ? "support"
        : debate.opposeVotes > debate.supportVotes
        ? "oppose"
        : null;
    await debate.save();

    return NextResponse.json(debate, { status: 200 });
  } catch (error) {
    console.error("Error closing debate:", error);
    return NextResponse.json(
      { message: "Error closing debate" },
      { status: 500 }
    );
  }
}
