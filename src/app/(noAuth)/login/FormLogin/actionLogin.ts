"use server";

import db from "@/lib/drizzle/db";
import { UsersTable } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import argon from "argon2";
import { signIn } from "@/auth";
import { User } from "next-auth";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { actionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";

const loginSchema = zfd.formData({
  identity: zfd.text(z.string()),
  password: zfd.text(z.string()),
});

export const loginAction = actionClient
  .schema(loginSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .bindArgsSchemas<[cbUrl: z.ZodString | z.ZodNullable<z.ZodString>]>([
    z.string().nullable(),
  ])
  .action(
    async ({
      parsedInput: { identity, password },
      bindArgsParsedInputs: [cbUrl],
    }) => {
      try {
        const [dbUser] = await db
          .select()
          .from(UsersTable)
          .where(
            identity.includes("@")
              ? eq(UsersTable.email, identity)
              : eq(UsersTable.username, identity),
          );

        if (!dbUser) {
          return {
            err: "User not found",
          };
        }

        if (!dbUser.password) {
          return {
            err: "invalid credentials",
          };
        }

        const isMatch = await argon.verify(dbUser.password, password);

        if (!isMatch) {
          return {
            err: "Wrong password",
          };
        }

        const myUser: User = {
          id: dbUser.id.toString(),
          name: dbUser.name,
          email: dbUser.email,
          image: dbUser.avatar,
          username: dbUser.username,
        };

        await signIn("credentials", {
          ...myUser,
          redirectTo: cbUrl ? cbUrl : "/",
        });
      } catch (err) {
        throw err;
      }
    },
  );
