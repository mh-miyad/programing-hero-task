import { connectDB } from "@/database/db.config";
import Debate from "@/database/models/Debate";
import { NextRequest, NextResponse } from "next/server";

import { Argument, Participant } from "@/Type/type";
import mongoose from "mongoose";

const bannedWords = ["stupid", "idiot", "dumb", "hate", "kill", "die"];

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const { authorId, authorName, side, content } = await req.json();
    if (!authorId || !authorName || !side || !content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    const lowerContent = content.toLowerCase();
    const foundBannedWord = bannedWords.find((word) =>
      lowerContent.includes(word)
    );
    if (foundBannedWord) {
      return NextResponse.json(
        { message: `Inappropriate content detected: "${foundBannedWord}"` },
        { status: 400 }
      );
    }

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

    const participant = debate.participants.find(
      (p: Participant) => p.userId === authorId && p.side === side
    );
    if (!participant) {
      return NextResponse.json(
        { message: "User not joined or incorrect side" },
        { status: 400 }
      );
    }

    const argument: Argument = {
      _id: new mongoose.Types.ObjectId().toString(),
      authorId,
      authorName,
      side,
      content,
      votes: 0,
      votedBy: [],
      createdAt: new Date().toISOString(),
    };

    debate.arguments.push(argument);
    await debate.save();

    return NextResponse.json(debate, { status: 200 });
  } catch (error) {
    console.error("Error adding argument:", error);
    return NextResponse.json(
      { message: "Error adding argument" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const { argumentId, content } = await req.json();

    const lowerContent = content.toLowerCase();
    const foundBannedWord = bannedWords.find((word) =>
      lowerContent.includes(word)
    );
    if (foundBannedWord) {
      return NextResponse.json(
        { message: `Inappropriate content detected: "${foundBannedWord}"` },
        { status: 400 }
      );
    }

    const debate = await Debate.findById(id);
    if (!debate) {
      return NextResponse.json(
        { message: "Debate not found" },
        { status: 404 }
      );
    }

    const argument = debate.arguments.find(
      (a: Argument) => a._id.toString() === argumentId
    );
    if (!argument) {
      return NextResponse.json(
        { message: "Argument not found" },
        { status: 404 }
      );
    }

    const timeDiff =
      (new Date().getTime() - new Date(argument.createdAt).getTime()) /
      (1000 * 60);
    if (timeDiff > 5) {
      return NextResponse.json(
        { message: "Edit window has expired" },
        { status: 400 }
      );
    }

    argument.content = content;
    await debate.save();

    return NextResponse.json(debate, { status: 200 });
  } catch (error) {
    console.error("Error editing argument:", error);
    return NextResponse.json(
      { message: "Error editing argument" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const { argumentId } = await req.json();

    const debate = await Debate.findById(id);
    if (!debate) {
      return NextResponse.json(
        { message: "Debate not found" },
        { status: 404 }
      );
    }

    const argument = debate.arguments.find(
      (a: Argument) => a._id.toString() === argumentId
    );
    if (!argument) {
      return NextResponse.json(
        { message: "Argument not found" },
        { status: 404 }
      );
    }

    const timeDiff =
      (new Date().getTime() - new Date(argument.createdAt).getTime()) /
      (1000 * 60);
    if (timeDiff > 5) {
      return NextResponse.json(
        { message: "Delete window has expired" },
        { status: 400 }
      );
    }

    debate.arguments = debate.arguments.filter(
      (a: Argument) => a._id.toString() !== argumentId
    );
    await debate.save();

    return NextResponse.json(debate, { status: 200 });
  } catch (error) {
    console.error("Error deleting argument:", error);
    return NextResponse.json(
      { message: "Error deleting argument" },
      { status: 500 }
    );
  }
}
