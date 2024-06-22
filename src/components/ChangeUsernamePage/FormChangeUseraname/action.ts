"use server";

import db from "@/lib/drizzle/db";
import { usernameSchema } from "./schema";
import { UsersTable } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

export const changeUsernameAction = async (
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
