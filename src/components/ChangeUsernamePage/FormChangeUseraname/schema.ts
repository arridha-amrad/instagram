import { z } from "zod";

export const usernameSchema = z.object({
  newUsername: z
    .string()
    .min(1, { message: "New Username is required" })
    .min(5, { message: "New Username is too short" })
    .max(20, { message: "New Username is too long" }),
  currentUsername: z
    .string()
    .min(1, { message: "Current username is required" }),
});
