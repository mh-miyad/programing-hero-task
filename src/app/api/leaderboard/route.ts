/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from "@/database/db.config";
import Debate from "@/database/models/Debate";
import { Argument } from "@/Type/type";
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

    // Fetch debates with optional time filter
    const debateQuery: any = {};
    if (dateFilter) {
      debateQuery.createdAt = { $gte: dateFilter };
    }
    const debates = await Debate.find(debateQuery);

    // Derive unique users from participants and arguments
    const userMap = new Map<string, { name: string; avatar: string }>();
    debates.forEach((debate) => {
      // From participants
      debate.participants.forEach((p: any) => {
        if (!userMap.has(p.userId)) {
          userMap.set(p.userId, {
            name: p.userId.split("@")[0],
            avatar: "/placeholder.svg",
          });
        }
      });
      // From arguments (to get authorName)
      debate.arguments.forEach((arg: Argument) => {
        if (!userMap.has(arg.authorId)) {
          userMap.set(arg.authorId, {
            name: arg.authorName,
            avatar: "/placeholder.svg",
          });
        } else {
          // Update name if available from arguments
          userMap.get(arg.authorId)!.name = arg.authorName;
        }
      });
    });

    // Calculate leaderboard data
    const leaderboard: any[] = Array.from(userMap.entries()).map(
      ([userId, { name, avatar }]) => {
        const userArguments = debates
          .flatMap((debate) => debate.arguments)
          .filter((arg) => arg.authorId === userId);
        const totalVotes = userArguments.reduce(
          (sum, arg) => sum + arg.votes,
          0
        );
        const debatesParticipated = debates.filter((debate) =>
          debate.participants.some((p: any) => p.userId === userId)
        ).length;
        const wins = debates.filter(
          (debate) =>
            !debate.isActive &&
            debate.winner &&
            debate.participants.some(
              (p: any) => p.userId === userId && p.side === debate.winner
            )
        ).length;

        return {
          id: userId,
          name,
          email: userId,
          avatar,
          totalVotes,
          debatesParticipated,
          argumentsPosted: userArguments.length,
          wins,
        };
      }
    );

    // Sort by totalVotes (descending)
    const sortedLeaderboard = leaderboard.sort(
      (a, b) => b.totalVotes - a.totalVotes
    );

    return NextResponse.json(sortedLeaderboard, { status: 200 });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { message: "Error fetching leaderboard" },
      { status: 500 }
    );
  }
}
