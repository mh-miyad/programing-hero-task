// Type/type.ts
import { debateSchema } from "@/Zod";
import { z } from "zod";

export type DebateForm = z.infer<typeof debateSchema>;

export interface Argument {
  _id: string;
  authorId: string;
  authorName: string;
  side: "support" | "oppose";
  content: string;
  votes: number;
  votedBy: string[];
  createdAt: string;
}

export interface Participant {
  userId: string;
  side: "support" | "oppose";
  joinedAt: string;
}

export interface Debate {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  banner: string;
  duration: number;
  endTime: string;
  createdAt: string;
  createdBy: string;
  participants: Participant[];
  arguments: Argument[];
  supportVotes: number;
  opposeVotes: number;
  totalVotes: number;
  isActive: boolean;
  winner: "support" | "oppose" | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedAt: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  email: string;
  avatar: string;
  totalVotes: number;
  debatesParticipated: number;
  argumentsPosted: number;
  wins: number;
}
