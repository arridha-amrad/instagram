"use server";

import UserService from "@/lib/drizzle/services/UserService";
import { SafeActionError } from "@/lib/errors/SafeActionError";
import { authActionClient } from "@/lib/safeAction";
import { redirect } from "next/navigation";
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
  .bindArgsSchemas<[cb_url: z.ZodString]>([z.string()])
  .action(
    async ({
      ctx: { session },
      bindArgsClientInputs: [cb_url],
      parsedInput: { currentUsername, newUsername },
    }) => {
      if (!session) {
        return redirect(`/login?cb_url=${cb_url}`);
      }

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
