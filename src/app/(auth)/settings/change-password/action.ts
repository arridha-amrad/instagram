"use server";

import UserService from "@/lib/drizzle/services/UserService";
import { SafeActionError } from "@/lib/errors/SafeActionError";
import { hashPassword, verifyPasswordHash } from "@/lib/passwordHandler";
import { authActionClient } from "@/lib/safeAction";
import { z } from "zod";
import { zfd } from "zod-form-data";

const schema = zfd.formData({
  oldPassword: zfd.text(z.string()),
  newPassword: zfd.text(z.string()),
});

export const changePassword = authActionClient
  .schema(schema)
  .bindArgsSchemas<[pathname: z.ZodString]>([z.string()])
  .action(
    async ({ ctx: { session }, parsedInput: { newPassword, oldPassword } }) => {
      const userId = session.user.id;
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
