"use server";

import config from "@/config.env";
import PasswordResetRequestService from "@/lib/drizzle/services/PasswordResetRequestService";
import { TransactionManager } from "@/lib/drizzle/services/TransactionManager";
import UserService from "@/lib/drizzle/services/UserService";
import EmailService from "@/lib/emailTransporter";
import { SafeActionError } from "@/lib/errors/SafeActionError";
import { actionClient } from "@/lib/safeAction";
import { createTokenForResetPassword } from "@/lib/tokenHandler";
import { generateRandomOTP } from "@/lib/utils";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const forgotPassword = actionClient
  .schema(
    zfd.formData({
      email: zfd.text(z.string().email()),
    }),
  )
  .action(async ({ parsedInput: { email } }) => {
    const userService = new UserService();
    const users = await userService.findUserByEmail(email);
    if (users.length === 0) {
      throw new SafeActionError("Email is not registered");
    }

    const tm = new TransactionManager();

    const response = await tm.execute(async (tx) => {
      const code = generateRandomOTP();
      const token = await createTokenForResetPassword(code, users[0].id);
      const passwordResetRequestService = new PasswordResetRequestService(tx);
      await passwordResetRequestService.create({
        code,
        userId: users[0].id,
      });
      return { token };
    });

    const link = `${config.BASE_URL}/reset-password?token=${response.token}`;

    await EmailService.sendEmail({
      to: email,
      subject: "Reset Password",
      html: `
      hi ${email},
      <br/>
      Please click this link to reset your password
      <br/>
      <br/>
      <a href=${link}>${link}</a>
      <br/>
      <br/>
      Thanks, The nextgram team
      `,
    });

    return `An email has been sent to ${email}. Please follow the instructions to reset your password`;
  });
