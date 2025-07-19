import { connectDB } from "@/database/db.config";
import Debate from "@/database/models/Debate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    const debate = await Debate.findById(id);
    if (!debate) {
      return NextResponse.json(
        { message: "Debate not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(debate, { status: 200 });
  } catch (error) {
    console.error("Error fetching debate:", error);
    return NextResponse.json(
      { message: "Error fetching debate" },
      { status: 500 }
    );
  }
}
