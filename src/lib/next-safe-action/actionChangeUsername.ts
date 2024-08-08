"use server";

import { flattenValidationErrors } from "next-safe-action";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { changeUsername } from "../drizzle/mutations/changeUsername";
import { authActionClient } from "./init";

const usernameSchema = zfd.formData({
  newUsername: zfd.text(
    z
      .string()
      .min(5, { message: "New Username is too short" })
      .max(20, { message: "New Username is too long" }),
  ),
  currentUsername: zfd.text(z.string()),
});

export const actionChangeUsername = authActionClient
  .schema(usernameSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      ctx: { userId },
      parsedInput: { currentUsername, newUsername },
    }) => {
      try {
        const result = await changeUsername({
          authUserId: userId,
          currentUsername,
          newUsername,
        });
        return result.username;
      } catch (err) {
        throw err;
      }
    },
  );
