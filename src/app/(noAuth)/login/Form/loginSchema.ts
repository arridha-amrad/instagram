import { z } from "zod";

export const loginSchema = z.object({
  identity: z.string().min(1, { message: "name is required" }),
  password: z.string().min(1, { message: "password is required" }),
});
