"use server";

import db from "@/lib/drizzle/db";
import { UsersTable } from "@/lib/drizzle/schema";
import { actionClient } from "@/lib/safe-action";
import { hash, verify } from "argon2";
import { eq } from "drizzle-orm";
import { flattenValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";
import { z } from "zod";
import { zfd } from "zod-form-data";

const schema = zfd.formData({
  oldPassword: zfd.text(z.string()),
  newPassword: zfd.text(z.string()),
});

export const changePasswordAction = actionClient
  .schema(schema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .bindArgsSchemas([z.string().min(1)])
  .action(
    async ({
      bindArgsParsedInputs: [userId],
      parsedInput: { newPassword, oldPassword },
    }) => {
      if (userId === "") {
        redirect("/login?cbUrl=/setings/change-password");
      }
      try {
        const user = await db.query.UsersTable.findFirst({
          where: eq(UsersTable.id, userId),
        });
        if (!user) {
          return {
            err: "User not found",
          };
        }
        if (!user.password) {
          return {
            err: "Your account is created using different provider",
          };
        }
        const isMatch = await verify(user.password, oldPassword);
        if (!isMatch) {
          return {
            err: "Wrong password",
          };
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
        console.log(err);
        throw err;
      }
    },
  );
