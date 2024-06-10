import { z } from "zod";

export const commentSchema = z.object({
  message: z.string().min(1, { message: "Message is required" }),
});
