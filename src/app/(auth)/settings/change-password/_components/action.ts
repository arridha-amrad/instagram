"use server";

import db from "@/lib/drizzle/db";
import { UsersTable } from "@/lib/drizzle/schema";
import { CustomServerError, authActionClient } from "@/lib/safe-action";
import { hash, verify } from "argon2";
import { eq } from "drizzle-orm";
import { flattenValidationErrors } from "next-safe-action";
import { z } from "zod";
import { zfd } from "zod-form-data";

const schema = zfd.formData({
  oldPassword: zfd.text(z.string()),
  newPassword: zfd.text(z.string()),
});

export const changePasswordAction = authActionClient
  .schema(schema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({ ctx: { userId }, parsedInput: { newPassword, oldPassword } }) => {
      try {
        const user = await db.query.UsersTable.findFirst({
          where: eq(UsersTable.id, userId),
        });
        if (!user) {
          throw new CustomServerError("User not found");
        }
        if (!user.password) {
          throw new CustomServerError(
            "Your account is created using different provider",
          );
        }
        const isMatch = await verify(user.password, oldPassword);
        if (!isMatch) {
          throw new CustomServerError("Wrong password");
        }
        const hashedPassword = await hash(newPassword);
        await db
          .update(UsersTable)
          .set({
            password: hashedPassword,
          })
          .where(eq(UsersTable.id, userId));
        return {
          message: "Password changed successfully",
        };
      } catch (err) {
        throw err;
      }
    },
  );
