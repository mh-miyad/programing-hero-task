import { Debate } from "@/Type/type";

export const mockDebates: Debate[] = [
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
