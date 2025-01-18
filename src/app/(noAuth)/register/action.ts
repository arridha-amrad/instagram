"use server";

import UserService from "@/lib/drizzle/services/UserService";
import { SafeActionError } from "@/lib/errors/SafeActionError";
import { hashPassword } from "@/lib/passwordHandler";
import { actionClient } from "@/lib/safeAction";
import { z } from "zod";
import { zfd } from "zod-form-data";

const schema = zfd.formData({
  name: zfd.text(z.string()),
  username: zfd.text(z.string()),
  email: zfd.text(z.string().email()),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export const signUp = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { email, name, password, username } }) => {
    const userService = new UserService();
    const userWithSameEmail = await userService.findUserByEmail(email);

    if (userWithSameEmail.length > 0) {
      throw new SafeActionError("Email has been registered");
    }

    const userWithSameUsername = await userService.findUserByUsername(username);

    if (userWithSameUsername.length > 0) {
      throw new SafeActionError("Username has been taken");
    }

    const hashedPassword = await hashPassword(password);

    await userService.createUser({
      email,
      name,
      provider: "credentials",
      username,
      password: hashedPassword,
    });

    return "Signup successful";
  });
