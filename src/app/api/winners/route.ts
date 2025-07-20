/* eslint-disable @typescript-eslint/no-explicit-any */

import { connectDB } from "@/database/db.config";
import Debate from "@/database/models/Debate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const timeFilter = searchParams.get("time") || "all-time";

    // Calculate time range
    let dateFilter: Date | undefined;
    if (timeFilter === "weekly") {
      dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeFilter === "monthly") {
      dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Fetch ended debates with a winner
    const query: any = { isActive: false, winner: { $ne: null } };
    if (dateFilter) {
      query.endTime = { $gte: dateFilter };
    }
    const winners = await Debate.find(query).sort({ endTime: -1 });

    return NextResponse.json(winners, { status: 200 });
  } catch (error) {
    console.error("Error fetching winners:", error);
    return NextResponse.json(
      { message: "Error fetching winners" },
      { status: 500 }
    );
  }
}
