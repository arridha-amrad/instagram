import { z } from "zod";

export const editProfileSchema = z.object({
  name: z.string().min(1, { message: "name is required" }),
  username: z.string().min(1, { message: "username is required" }),
  website: z.string().min(1, { message: "password is required" }).optional(),
  occupation: z
    .string()
    .min(1, { message: "occupation is required" })
    .optional(),
  bio: z.string().optional(),
  gender: z.string().optional(),
});
