import { Schema, model, models } from "mongoose";

const DebateSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],
  category: { type: String, required: true },
  banner: { type: String },
  duration: { type: Number, required: true },
  endTime: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
  participants: [
    {
      userId: { type: String, required: true },
      side: { type: String, enum: ["support", "oppose"], required: true },
      joinedAt: { type: Date, default: Date.now },
    },
  ],
  arguments: [
    {
      authorId: { type: String, required: true },
      authorName: { type: String, required: true },
      side: { type: String, enum: ["support", "oppose"], required: true },
      content: { type: String, required: true },
      votes: { type: Number, default: 0 },
      votedBy: [{ type: String }],
      createdAt: { type: Date, default: Date.now },
    },
  ],
  supportVotes: { type: Number, default: 0 },
  opposeVotes: { type: Number, default: 0 },
  totalVotes: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  winner: { type: String, enum: ["support", "oppose", null], default: null },
});

const Debate = models.Debate || model("Debate", DebateSchema);

export default Debate;
