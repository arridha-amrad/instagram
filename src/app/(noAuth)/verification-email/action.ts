"use server";

import { signIn } from "@/auth";
import EmailVerificationRequestService from "@/lib/drizzle/services/EmailVerificationRequestService";
import { TransactionManager } from "@/lib/drizzle/services/TransactionManager";
import UserService from "@/lib/drizzle/services/UserService";
import { SafeActionError } from "@/lib/errors/SafeActionError";
import { actionClient } from "@/lib/safeAction";
import { deleteEmailVerificationRequestCookie } from "@/lib/utils";
import { cookies } from "next/headers";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const verifyEmail = actionClient
  .schema(
    zfd.formData({
      code: zfd.text(z.string()),
    }),
  )
  .bindArgsSchemas<[id: z.ZodString]>([z.string()])
  .action(async ({ parsedInput: { code }, bindArgsParsedInputs: [id] }) => {
    const tm = new TransactionManager();

    const response = await tm.execute(async (tx) => {
      const userService = new UserService(tx);
      const emailService = new EmailVerificationRequestService(tx);

      const findRequest = await emailService.findById(id);

      if (findRequest.length === 0) {
        throw new SafeActionError("Invalid request");
      }

      const isMatch = findRequest[0].code === code;

      if (!isMatch) {
        throw new SafeActionError("Invalid code");
      }

      await emailService.removeByUserId(findRequest[0].userId);

      const cookie = await cookies();

      await deleteEmailVerificationRequestCookie(cookie);

      const users = await userService.updateUser(findRequest[0].userId, {
        verifiedAt: new Date(),
      });

      return users;
    });

    await signIn("credentials", {
      id: response[0].id,
      name: response[0].name,
      email: response[0].email,
      image: response[0].avatar,
      username: response[0].username,
      redirectTo: "/",
    });
  });
