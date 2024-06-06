import { z } from "zod";

export const registrationSchema = z.object({
  name: z
    .string()
    .min(1, { message: "name is required" })
    .min(5, { message: "name is too short" }),
  email: z.string().email(),
  username: z
    .string()
    .min(1, { message: "username is required" })
    .min(5, { message: "username is too short" }),
  password: z
    .string()
    .min(1, { message: "password is required" })
    .min(5, { message: "password is too short" }),
});
