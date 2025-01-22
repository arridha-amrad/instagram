"use server";

import { actionClient } from "@/lib/safeAction";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const forgotPassword = actionClient
  .schema(
    zfd.formData({
      email: zfd.text(z.string().email()),
    }),
  )
  .action(async ({ parsedInput: { email } }) => {
    // invalidateUserPasswordResetSessions(user.id);
    // const sessionToken = generateSessionToken();
    // const session = createPasswordResetSession(sessionToken, user.id, user.email);
    // sendPasswordResetEmail(session.email, session.code);
    // setPasswordResetSessionTokenCookie(sessionToken, session.expiresAt);
  });
