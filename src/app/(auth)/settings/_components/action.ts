"use server";

import db from "@/lib/drizzle/db";
import { UserInfoTable, UsersTable } from "@/lib/drizzle/schema";
import { authActionClient } from "@/lib/safe-action";
import { eq } from "drizzle-orm";
import { flattenValidationErrors } from "next-safe-action";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

const schema = zfd.formData({
  name: zfd.text(z.string().min(1, { message: "name is required" })),
  website: zfd.text(z.string().optional()),
  occupation: zfd.text(z.string().optional()),
  bio: zfd.text(z.string().optional()),
  gender: zfd.text(z.string().optional()),
});

export const editProfileAction = authActionClient
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
        const response = await db.transaction(async (tx) => {
          const [result] = await tx
            .update(UsersTable)
            .set({
              name,
            })
            .where(eq(UsersTable.id, userId))
            .returning({
              name: UsersTable.name,
            });
          await tx
            .insert(UserInfoTable)
            .values({
              userId,
              bio,
              gender: gender === "female" ? "female" : "male",
              occupation,
              website,
            })
            .onConflictDoUpdate({
              target: UserInfoTable.userId,
              set: {
                userId,
                bio,
                gender: gender === "female" ? "female" : "male",
                occupation,
                website,
              },
            });
          return result;
        });
        revalidateTag("fetch-user");
        return {
          message: "Profile updated",
          user: response,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  );
