"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedAt: string;
}

export interface Participant {
  userId: string;
  side: "support" | "oppose";
  joinedAt: string;
}

export interface Argument {
  id: string;
  authorId: string;
  authorName: string;
  side: "support" | "oppose";
  content: string;
  votes: number;
  votedBy: string[];
  createdAt: string;
}

export interface Debate {
  id: string;
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

interface DebateStore {
  user: User | null;
  users: User[];
  debates: Debate[];
  signIn: () => void;
  signOut: () => void;
  addDebate: (debate: Debate) => void;
  joinDebate: (
    debateId: string,
    userId: string,
    side: "support" | "oppose"
  ) => void;
  addArgument: (debateId: string, argument: Argument) => void;
  voteOnArgument: (
    debateId: string,
    argumentId: string,
    userId: string
  ) => void;
  updateArgument: (
    debateId: string,
    argumentId: string,
    content: string
  ) => void;
  deleteArgument: (debateId: string, argumentId: string) => void;
  checkDebateStatus: () => void;
}

// Mock users for demo
const mockUsers: User[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    joinedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    joinedAt: "2024-02-01T14:30:00Z",
  },
  {
    id: "3",
    name: "Mike Rodriguez",
    email: "mike@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    joinedAt: "2024-02-15T09:15:00Z",
  },
  {
    id: "4",
    name: "Emma Thompson",
    email: "emma@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    joinedAt: "2024-03-01T16:45:00Z",
  },
];

// Mock debates for demo
const mockDebates: Debate[] = [
  {
    id: "1",
    title:
      "Should artificial intelligence replace human jobs in customer service?",
    description:
      "With AI becoming more sophisticated, many companies are considering replacing human customer service representatives with AI chatbots. This could reduce costs but may impact employment and service quality.",
    tags: ["AI", "employment", "technology", "customer-service"],
    category: "tech",
    banner: "/placeholder.svg?height=200&width=400",
    duration: 24,
    endTime: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(), // 20 hours from now
    createdAt: "2024-07-17T10:00:00Z",
    createdBy: "1",
    participants: [
      { userId: "1", side: "support", joinedAt: "2024-07-17T10:05:00Z" },
      { userId: "2", side: "oppose", joinedAt: "2024-07-17T10:10:00Z" },
      { userId: "3", side: "support", joinedAt: "2024-07-17T11:00:00Z" },
    ],
    arguments: [
      {
        id: "1",
        authorId: "1",
        authorName: "Alex Johnson",
        side: "support",
        content:
          "AI can provide 24/7 customer service without breaks, reducing wait times and improving efficiency. It can handle multiple customers simultaneously and provide consistent responses.",
        votes: 15,
        votedBy: ["2", "3", "4"],
        createdAt: "2024-07-17T10:15:00Z",
      },
      {
        id: "2",
        authorId: "2",
        authorName: "Sarah Chen",
        side: "oppose",
        content:
          "Human customer service representatives provide empathy and emotional intelligence that AI cannot replicate. Complex issues often require human judgment and creative problem-solving.",
        votes: 12,
        votedBy: ["1", "3"],
        createdAt: "2024-07-17T10:20:00Z",
      },
      {
        id: "3",
        authorId: "3",
        authorName: "Mike Rodriguez",
        side: "support",
        content:
          "AI systems can be trained on vast amounts of data to provide more accurate and comprehensive solutions. They don't have bad days or personal biases affecting their service quality.",
        votes: 8,
        votedBy: ["1", "4"],
        createdAt: "2024-07-17T11:05:00Z",
      },
    ],
    supportVotes: 23,
    opposeVotes: 12,
    totalVotes: 35,
    isActive: true,
    winner: null,
  },
  {
    id: "2",
    title:
      "Should social media platforms be held responsible for misinformation?",
    description:
      "The spread of false information on social media has become a major concern. Should platforms like Facebook, Twitter, and TikTok be legally responsible for the content shared by their users?",
    tags: ["social-media", "misinformation", "regulation", "free-speech"],
    category: "society",
    banner: "/placeholder.svg?height=200&width=400",
    duration: 12,
    endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
    createdAt: "2024-07-17T14:00:00Z",
    createdBy: "2",
    participants: [
      { userId: "2", side: "support", joinedAt: "2024-07-17T14:05:00Z" },
      { userId: "4", side: "oppose", joinedAt: "2024-07-17T14:15:00Z" },
    ],
    arguments: [
      {
        id: "4",
        authorId: "2",
        authorName: "Sarah Chen",
        side: "support",
        content:
          "Social media platforms have the technology and resources to detect and prevent misinformation. They profit from user engagement, so they should be responsible for ensuring the content is accurate.",
        votes: 18,
        votedBy: ["1", "3", "4"],
        createdAt: "2024-07-17T14:10:00Z",
      },
      {
        id: "5",
        authorId: "4",
        authorName: "Emma Thompson",
        side: "oppose",
        content:
          "Holding platforms responsible could lead to over-censorship and stifle free speech. It's difficult to determine what constitutes misinformation, and this responsibility should lie with users and fact-checkers.",
        votes: 14,
        votedBy: ["1", "2", "3"],
        createdAt: "2024-07-17T14:25:00Z",
      },
    ],
    supportVotes: 18,
    opposeVotes: 14,
    totalVotes: 32,
    isActive: true,
    winner: null,
  },
  {
    id: "3",
    title: "Should genetic engineering be used to enhance human capabilities?",
    description:
      "CRISPR and other genetic engineering technologies now allow us to potentially enhance human intelligence, strength, and disease resistance. Should we use these technologies to improve human capabilities?",
    tags: ["genetics", "enhancement", "ethics", "CRISPR"],
    category: "science",
    banner: "/placeholder.svg?height=200&width=400",
    duration: 72,
    endTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Ended 2 hours ago
    createdAt: "2024-07-14T09:00:00Z",
    createdBy: "3",
    participants: [
      { userId: "1", side: "oppose", joinedAt: "2024-07-14T09:15:00Z" },
      { userId: "3", side: "support", joinedAt: "2024-07-14T09:05:00Z" },
      { userId: "4", side: "oppose", joinedAt: "2024-07-14T10:30:00Z" },
    ],
    arguments: [
      {
        id: "6",
        authorId: "3",
        authorName: "Mike Rodriguez",
        side: "support",
        content:
          "Genetic enhancement could eliminate hereditary diseases and improve quality of life for millions. We already use technology to enhance our capabilities - this is just the next step in human evolution.",
        votes: 22,
        votedBy: ["2", "4"],
        createdAt: "2024-07-14T09:20:00Z",
      },
      {
        id: "7",
        authorId: "1",
        authorName: "Alex Johnson",
        side: "oppose",
        content:
          "Genetic enhancement could create inequality between enhanced and non-enhanced humans. There are also unknown long-term consequences that could affect future generations.",
        votes: 28,
        votedBy: ["2", "3", "4"],
        createdAt: "2024-07-14T09:45:00Z",
      },
      {
        id: "8",
        authorId: "4",
        authorName: "Emma Thompson",
        side: "oppose",
        content:
          "We should focus on using genetic engineering to treat diseases rather than enhance normal human capabilities. Enhancement raises ethical questions about what it means to be human.",
        votes: 19,
        votedBy: ["1", "2"],
        createdAt: "2024-07-14T11:00:00Z",
      },
    ],
    supportVotes: 22,
    opposeVotes: 47,
    totalVotes: 69,
    isActive: false,
    winner: "oppose",
  },
];

export const useDebateStore = create<DebateStore>()(
  persist(
    (set) => ({
      user: null,
      users: mockUsers,

      signIn: (user) => {
        set({ user });
      },

      signOut: () => {
        set({ user: null });
      },

      addDebate: (debate) => {
        set((state) => ({
          debates: [debate, ...state.debates],
        }));
      },

      joinDebate: (debateId, userId, side) => {
        set((state) => ({
          debates: state.debates.map((debate) => {
            if (debate.id === debateId) {
              const existingParticipant = debate.participants.find(
                (p) => p.userId === userId
              );
              if (!existingParticipant) {
                return {
                  ...debate,
                  participants: [
                    ...debate.participants,
                    {
                      userId,
                      side,
                      joinedAt: new Date().toISOString(),
                    },
                  ],
                };
              }
            }
            return debate;
          }),
        }));
      },

      addArgument: (debateId, argument) => {
        set((state) => ({
          debates: state.debates.map((debate) => {
            if (debate.id === debateId) {
              return {
                ...debate,
                arguments: [...debate.arguments, argument],
              };
            }
            return debate;
          }),
        }));
      },

      voteOnArgument: (debateId, argumentId, userId) => {
        set((state) => ({
          debates: state.debates.map((debate) => {
            if (debate.id === debateId) {
              const updatedArguments = debate.arguments.map((arg) => {
                if (arg.id === argumentId && !arg.votedBy.includes(userId)) {
                  return {
                    ...arg,
                    votes: arg.votes + 1,
                    votedBy: [...arg.votedBy, userId],
                  };
                }
                return arg;
              });

              // Recalculate vote totals
              const supportVotes = updatedArguments
                .filter((arg) => arg.side === "support")
                .reduce((sum, arg) => sum + arg.votes, 0);

              const opposeVotes = updatedArguments
                .filter((arg) => arg.side === "oppose")
                .reduce((sum, arg) => sum + arg.votes, 0);

              return {
                ...debate,
                arguments: updatedArguments,
                supportVotes,
                opposeVotes,
                totalVotes: supportVotes + opposeVotes,
              };
            }
            return debate;
          }),
        }));
      },

      updateArgument: (debateId, argumentId, content) => {
        set((state) => ({
          debates: state.debates.map((debate) => {
            if (debate.id === debateId) {
              return {
                ...debate,
                arguments: debate.arguments.map((arg) => {
                  if (arg.id === argumentId) {
                    return { ...arg, content };
                  }
                  return arg;
                }),
              };
            }
            return debate;
          }),
        }));
      },

      deleteArgument: (debateId, argumentId) => {
        set((state) => ({
          debates: state.debates.map((debate) => {
            if (debate.id === debateId) {
              const updatedArguments = debate.arguments.filter(
                (arg) => arg.id !== argumentId
              );

              // Recalculate vote totals
              const supportVotes = updatedArguments
                .filter((arg) => arg.side === "support")
                .reduce((sum, arg) => sum + arg.votes, 0);

              const opposeVotes = updatedArguments
                .filter((arg) => arg.side === "oppose")
                .reduce((sum, arg) => sum + arg.votes, 0);

              return {
                ...debate,
                arguments: updatedArguments,
                supportVotes,
                opposeVotes,
                totalVotes: supportVotes + opposeVotes,
              };
            }
            return debate;
          }),
        }));
      },

      checkDebateStatus: () => {
        set((state) => ({
          debates: state.debates.map((debate) => {
            const now = new Date();
            const endTime = new Date(debate.endTime);

            if (endTime <= now && debate.isActive) {
              const winner =
                debate.supportVotes > debate.opposeVotes
                  ? "support"
                  : debate.opposeVotes > debate.supportVotes
                  ? "oppose"
                  : null;

              return {
                ...debate,
                isActive: false,
                winner,
              };
            }
            return debate;
          }),
        }));
      },
    }),
    {
      name: "debate-store",
      partialize: (state) => ({
        user: state.user,
        debates: state.debates,
      }),
    }
  )
);
