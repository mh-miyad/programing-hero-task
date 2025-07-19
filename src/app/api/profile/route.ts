/* eslint-disable @typescript-eslint/no-explicit-any */

import { connectDB } from "@/database/db.config";
import Debate from "@/database/models/Debate";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch debates where the user participated or posted arguments
    const debates = await Debate.find({
      $or: [
        { participants: { $elemMatch: { userId } } },
        { arguments: { $elemMatch: { authorId: userId } } },
      ],
    });

    // Calculate stats
    const userArguments = debates
      .flatMap((debate) => debate.arguments)
      .filter((arg) => arg.authorId === userId);
    const totalVotes = userArguments.reduce((sum, arg) => sum + arg.votes, 0);
    const debatesParticipated = debates.filter((debate) =>
      debate.participants.some((p: any) => p.userId === userId)
    ).length;
    const debatesWon = debates.filter((debate) => {
      const userParticipation = debate.participants.find(
        (p: any) => p.userId === userId
      );
      return debate.winner && userParticipation?.side === debate.winner;
    }).length;
    const winRate =
      debatesParticipated > 0
        ? Math.round((debatesWon / debatesParticipated) * 100)
        : 0;
    const recentArguments = userArguments
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);

    // Derive user data from arguments or participants
    const userData = {
      id: userId,
      name: userArguments[0]?.authorName || userId.split("@")[0],
      email: userId,
      avatar: "/placeholder.svg",
    };

    const profileData: any = {
      user: userData,
      debatesParticipated,
      totalVotes,
      argumentsPosted: userArguments.length,
      debatesWon,
      winRate,
      recentArguments,
      debates, // Include all relevant debates
    };

    return NextResponse.json(profileData, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { message: "Error fetching profile" },
      { status: 500 }
    );
  }
}
