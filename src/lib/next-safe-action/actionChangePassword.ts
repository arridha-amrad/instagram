"use server";

import { flattenValidationErrors } from "next-safe-action";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { changePassword } from "../drizzle/mutations/changePassword";
import { authClient } from "./init";

const schema = zfd.formData({
  oldPassword: zfd.text(z.string()),
  newPassword: zfd.text(z.string()),
});

export const actionChangePassword = authClient
  .schema(schema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({ ctx: { userId }, parsedInput: { newPassword, oldPassword } }) => {
      try {
        await changePassword({ authUserId: userId, newPassword, oldPassword });
      } catch (err) {
        throw err;
      }
    },
  );
