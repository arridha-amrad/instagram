"use server";

import db from "@/lib/drizzle/db";
import { UsersTable } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { actionClient } from "@/lib/safe-action";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { flattenValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";

const usernameSchema = zfd.formData({
  newUsername: zfd.text(
    z
      .string()
      .min(5, { message: "New Username is too short" })
      .max(20, { message: "New Username is too long" }),
  ),
  currentUsername: zfd.text(z.string()),
});

export const changeUsernameAction = actionClient
  .schema(usernameSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .bindArgsSchemas<[userId: z.ZodString]>([z.string()])
  .action(
    async ({
      bindArgsParsedInputs: [userId],
      parsedInput: { currentUsername, newUsername },
    }) => {
      if (userId === "") {
        redirect("/");
      }
      try {
        const user = await db.query.UsersTable.findFirst({
          columns: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
          where: eq(UsersTable.id, userId),
        });

        if (!user) {
          return {
            err: "User not found",
          };
        }

        const isMatch = user.username === currentUsername;
        if (!isMatch) {
          return {
            err: "Wrong username",
          };
        }

        const [result] = await db
          .update(UsersTable)
          .set({
            username: newUsername,
          })
          .where(eq(UsersTable.id, userId))
          .returning({
            id: UsersTable.id,
            username: UsersTable.username,
            name: UsersTable.name,
            avatar: UsersTable.avatar,
          });

        return {
          data: result,
          message: "Username change successfully",
        };
      } catch (err) {
        throw err;
      }
    },
  );

export const _changeUsernameAction = async (
  userId: string,
  prevState: any,
  formData: FormData,
) => {
  if (userId === "") {
    return {
      type: "error",
      message: "Session is not ready yet",
    };
  }
  const validateSchema = usernameSchema.safeParse({
    currentUsername: formData.get("currentUsername") as string,
    newUsername: formData.get("newUsername") as string,
  });

  if (!validateSchema.success) {
    return {
      errors: validateSchema.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await db.query.UsersTable.findFirst({
      columns: {
        id: true,
        name: true,
        username: true,
        avatar: true,
      },
      where: eq(UsersTable.id, userId),
    });

    if (!user) {
      return {
        type: "error",
        message: "User not found",
      };
    }

    const isMatch = user.username === validateSchema.data.currentUsername;
    if (!isMatch) {
      return {
        type: "error",
        message: "Wrong username",
      };
    }

    const [result] = await db
      .update(UsersTable)
      .set({
        username: validateSchema.data.newUsername,
      })
      .where(eq(UsersTable.id, userId))
      .returning({
        id: UsersTable.id,
        username: UsersTable.username,
        name: UsersTable.name,
        avatar: UsersTable.avatar,
      });

    return {
      data: result,
      type: "success",
      message: "Username change successfully",
    };
  } catch (err) {
    return {
      type: "error",
      message: "Something went wrong",
    };
  }
};
