"use server";

import { authActionClient } from "@/lib/next-safe-action/init";
import { flattenValidationErrors } from "next-safe-action";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { createPost } from "../drizzle/mutations/createPost";
import { revalidateTag } from "next/cache";

const schema = zfd.formData({
  images: zfd.file().array(),
  description: zfd.text(z.string().optional()),
  location: zfd.text(z.string().optional()),
  pathname: zfd.text(z.string()),
});

export const actionCreatePost = authActionClient
  .schema(schema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      ctx: { userId },
      parsedInput: { description, images, location },
    }) => {
      try {
        const result = await createPost({
          authUserId: userId,
          description,
          images,
          location,
        });
        revalidateTag("fetchFeedPosts");
        revalidateTag("fetchUserPosts");
        return result;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  );
