"use server";

import UserService from "@/lib/drizzle/services/UserService";
import { SafeActionError } from "@/lib/errors/SafeActionError";
import { authClient } from "@/lib/next-safe-action/init";
import { hashPassword, verifyPasswordHash } from "@/lib/passwordHandler";
import { z } from "zod";
import { zfd } from "zod-form-data";

const schema = zfd.formData({
  oldPassword: zfd.text(z.string()),
  newPassword: zfd.text(z.string()),
});

export const changePassword = authClient
  .schema(schema)
  .action(
    async ({ ctx: { userId }, parsedInput: { newPassword, oldPassword } }) => {
      const userService = new UserService();
      const user = await userService.findUserById(userId);

      if (!user[0].password) {
        throw new SafeActionError(
          "Your account is created using different provider",
        );
      }
      const isMatch = await verifyPasswordHash(user[0].password, oldPassword);

      if (!isMatch) {
        throw new SafeActionError("Wrong password");
      }

      const hashedPassword = await hashPassword(newPassword);

      await userService.updateUser(userId, { password: hashedPassword });

      return "Password updated successfully";
    },
  );
