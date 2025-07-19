import { z } from "zod";
export const debateSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(200, "Title too long"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(1000, "Description too long"),
  category: z.string().min(1, "Please select a category"),
  duration: z.string().min(1, "Please select a duration"),
  banner: z.string().optional(),
});
