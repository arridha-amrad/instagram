"use server";

import { flattenValidationErrors } from "next-safe-action";
import { zfd } from "zod-form-data";
import { updatedAvatar } from "../drizzle/mutations/updateAvatar";
import { authActionClient } from "./init";

const schema = zfd.formData({
  image: zfd.file(),
});

export const actionChangeAvatar = authActionClient
  .schema(schema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ ctx: { userId }, parsedInput: { image } }) => {
    try {
      const result = await updatedAvatar({ authUserId: userId, image });
      return {
        message: "Avatar updated successfully",
        user: result,
      };
    } catch (err) {
      throw err;
    }
  });
