"use server";

import PasswordResetRequestService from "@/lib/drizzle/services/PasswordResetRequestService";
import { TransactionManager } from "@/lib/drizzle/services/TransactionManager";
import UserService from "@/lib/drizzle/services/UserService";
import { SafeActionError } from "@/lib/errors/SafeActionError";
import { hashPassword } from "@/lib/passwordHandler";
import { actionClient } from "@/lib/safeAction";
import { verifyTokenForResetPassword } from "@/lib/tokenHandler";
import { redirect } from "next/navigation";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const resetPassword = actionClient
  .schema(
    zfd
      .formData({
        password: z
          .string()
          .min(8, { message: "Be at least 8 characters long" })
          .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
          .regex(/[0-9]/, { message: "Contain at least one number." })
          .regex(/[^a-zA-Z0-9]/, {
            message: "Contain at least one special character.",
          })
          .trim(),
        confirmPassword: zfd.text(z.string()),
      })
      .refine(async (data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords don't match",
      }),
  )
  .bindArgsSchemas<[token: z.ZodNullable<z.ZodString>]>([z.string().nullable()])
  .action(
    async ({ parsedInput: { password }, bindArgsParsedInputs: [token] }) => {
      if (!token) {
        throw new SafeActionError("Your request is invalid");
      }
      const { userId, code } = (await verifyTokenForResetPassword(token)) as {
        userId: string;
        code: string;
      };
      const passwordResetRequestService = new PasswordResetRequestService();
      const rows = await passwordResetRequestService.findByUserIdAndCode(
        userId,
        code,
      );
      if (rows.length === 0) {
        throw new SafeActionError(
          "Your request is invalid. the token is wrong",
        );
      }
      const tm = new TransactionManager();
      await tm.execute(async (tx) => {
        const userService = new UserService(tx);
        const users = await userService.findUserById(userId);
        if (users[0].verifiedAt === null) {
          throw new SafeActionError("Your email is not verified");
        }
        const hashedPassword = await hashPassword(password);
        await userService.updateUser(userId, {
          password: hashedPassword,
        });
      });

      await passwordResetRequestService.removeByUserId(userId);
      return redirect("/login?message=Your password is updated successfully");
    },
  );
