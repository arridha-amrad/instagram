"use server";

import UserService from "@/lib/drizzle/services/UserService";
import { SafeActionError } from "@/lib/errors/SafeActionError";
import { authActionClient } from "@/lib/safeAction";
import { z } from "zod";
import { zfd } from "zod-form-data";

const usernameSchema = zfd.formData({
  newUsername: zfd.text(
    z
      .string()
      .min(5, { message: "New Username is too short" })
      .max(20, { message: "New Username is too long" }),
  ),
  currentUsername: zfd.text(z.string()),
});

export const changeUsername = authActionClient
  .schema(usernameSchema)
  .bindArgsSchemas<[pathname: z.ZodString]>([z.string()])
  .action(
    async ({
      ctx: { session },
      parsedInput: { currentUsername, newUsername },
    }) => {
      const {
        user: { id },
      } = session;
      const userService = new UserService();
      const [user] = await userService.findUserById(id);
      const isMatch = user.username === currentUsername;
      if (!isMatch) {
        throw new SafeActionError("Wrong username");
      }
      await userService.updateUser(id, {
        username: newUsername,
      });
      return "Username is updated successfully";
    },
  );
