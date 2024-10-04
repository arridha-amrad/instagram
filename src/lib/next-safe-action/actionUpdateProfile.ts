"use server";

import { flattenValidationErrors } from "next-safe-action";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { updateProfile } from "../drizzle/mutations/updateProfile";
import { authClient } from "./init";

const schema = zfd.formData({
  name: zfd.text(z.string().min(1, { message: "name is required" })),
  website: zfd.text(z.string().optional()),
  occupation: zfd.text(z.string().optional()),
  bio: zfd.text(z.string().optional()),
  gender: zfd.text(z.string().optional()),
});

export const actionUpdateProfile = authClient
  .schema(schema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      ctx: { userId },
      parsedInput: { name, bio, gender, occupation, website },
    }) => {
      try {
        const result = await updateProfile({
          authUserId: userId,
          name,
          bio,
          gender,
          occupation,
          website,
        });
        revalidateTag("fetchUserProfile");
        revalidateTag("fetchUserProfileDetails");
        return result.name;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  );
