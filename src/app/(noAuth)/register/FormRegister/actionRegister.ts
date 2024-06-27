"use server";

import db from "@/lib/drizzle/db";
import { UsersTable } from "@/lib/drizzle/schema";
import { actionClient } from "@/lib/safe-action";
import argon from "argon2";
import { eq } from "drizzle-orm";
import { flattenValidationErrors } from "next-safe-action";
import { z } from "zod";
import { zfd } from "zod-form-data";

const registrationSchema = zfd.formData({
  name: zfd.text(
    z
      .string()
      .min(1, { message: "name is required" })
      .min(5, { message: "name is too short" }),
  ),
  email: zfd.text(z.string().email()),
  username: zfd.text(
    z
      .string()
      .min(1, { message: "username is required" })
      .min(5, { message: "username is too short" }),
  ),
  password: zfd.text(
    z
      .string()
      .min(1, { message: "password is required" })
      .min(5, { message: "password is too short" }),
  ),
});

export const registerAction = actionClient
  .schema(registrationSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { email, name, password, username } }) => {
    try {
      const [userWithSameEmail] = await db
        .select()
        .from(UsersTable)
        .where(eq(UsersTable.email, email));

      if (userWithSameEmail) {
        return {
          err: "Email is already taken",
        };
      }

      const [userWithSameUsername] = await db
        .select()
        .from(UsersTable)
        .where(eq(UsersTable.username, username));

      if (userWithSameUsername) {
        return {
          err: "Username is already taken",
        };
      }

      const hashedPassword = await argon.hash(password);

      await db.insert(UsersTable).values({
        email,
        name,
        provider: "credentials",
        username,
        password: hashedPassword,
      });

      return {
        message: "Registration is successful",
      };
    } catch (err) {
      throw err;
    }
  });
