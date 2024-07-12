"use server";

import { upload } from "@/lib/cloudinary";
import db from "@/lib/drizzle/db";
import { UsersTable } from "@/lib/drizzle/schema";
import { authActionClient } from "@/lib/safe-action";
import { eq } from "drizzle-orm";
import { flattenValidationErrors } from "next-safe-action";
import { revalidateTag } from "next/cache";
import { zfd } from "zod-form-data";

const schema = zfd.formData({
  image: zfd.file(),
});

export const changeAvatarAction = authActionClient
  .schema(schema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ ctx: { userId }, parsedInput: { image } }) => {
    try {
      const response = await upload(image, true);
      const [result] = await db
        .update(UsersTable)
        .set({
          avatar: response.secure_url,
        })
        .where(eq(UsersTable.id, userId))
        .returning({
          id: UsersTable.id,
          name: UsersTable.name,
          image: UsersTable.avatar,
          username: UsersTable.username,
        });
      revalidateTag("fetch-user");
      return {
        message: "avatar updated",
        user: result,
      };
    } catch (err) {
      throw err;
    }
  });
