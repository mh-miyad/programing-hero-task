import { debateSchema } from "@/Zod";
import z from "zod";

export type DebateForm = z.infer<typeof debateSchema>;
