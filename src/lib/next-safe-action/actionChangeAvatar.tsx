"use server";

import { flattenValidationErrors } from "next-safe-action";
import { zfd } from "zod-form-data";
import { updatedAvatar } from "../drizzle/mutations/updateAvatar";
import { authClient } from "./init";
import { revalidateTag } from "next/cache";

const schema = zfd.formData({
  image: zfd.file(),
});

export const actionChangeAvatar = authClient
  .schema(schema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ ctx: { userId }, parsedInput: { image } }) => {
    try {
      const result = await updatedAvatar({ authUserId: userId, image });
      revalidateTag("fetchUserProfile");
      return result;
    } catch (err) {
      throw err;
    }
  });
