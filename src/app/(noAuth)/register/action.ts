"use server";

import EmailVerificationRequestService from "@/lib/drizzle/services/EmailVerificationRequestService";
import { TransactionManager } from "@/lib/drizzle/services/TransactionManager";
import UserService from "@/lib/drizzle/services/UserService";
import EmailService from "@/lib/emailTransporter";
import { SafeActionError } from "@/lib/errors/SafeActionError";
import { hashPassword } from "@/lib/passwordHandler";
import { actionClient } from "@/lib/safeAction";
import {
  generateRandomOTP,
  setEmailVerificationRequestCookie,
} from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
    const cookie = await cookies();

    if (userWithSameEmail.length > 0) {
      throw new SafeActionError("Email has been registered");
    }

    const userWithSameUsername = await userService.findUserByUsername(username);

    if (userWithSameUsername.length > 0) {
      throw new SafeActionError("Username has been taken");
    }

    const hashedPassword = await hashPassword(password);

    const tm = new TransactionManager();
    const response = await tm.execute(async (tx) => {
      const txUserService = new UserService(tx);
      const [newUser] = await txUserService.createUser({
        email,
        name,
        provider: "credentials",
        username,
        password: hashedPassword,
      });
      // create email verification request
      const emailService = new EmailVerificationRequestService(tx);
      const code = generateRandomOTP();
      const [request] = await emailService.create({
        code,
        email,
        userId: newUser.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
      });
      return request;
    });

    // set email verification request cookie
    await setEmailVerificationRequestCookie(
      response.id,
      response.expiresAt,
      cookie,
    );

    // send verification email
    await EmailService.sendEmail({
      subject: "Email verification",
      to: email,
      html: `
          hi ${email}
          <br/>
          <br/>
          This is your verification code : ${response.code}
          <br/>
          <br/>
          Thanks,
          The nextgram team
          `,
    });

    redirect("/verification-email");
  });
