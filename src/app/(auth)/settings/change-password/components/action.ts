"use server";

import db from "@/lib/drizzle/db";
import { UsersTable } from "@/lib/drizzle/schema";
import { hash, verify } from "argon2";
import { eq } from "drizzle-orm";

export const changePasswordAction = async (
  userId: string,
  prevState: any,
  formData: FormData,
) => {
  const oldPassword = formData.get("oldPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  try {
    const user = await db.query.UsersTable.findFirst({
      where: eq(UsersTable.id, userId),
    });
    if (!user) {
      return {
        type: "error",
        message: "User not found",
      };
    }
    if (!user.password) {
      return {
        type: "error",
        message: "Your account is created using different provider",
      };
    }
    const isMatch = await verify(user.password, oldPassword);
    if (!isMatch) {
      return {
        type: "error",
        message: "Wrong password",
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
      type: "success",
      message: "Password changed successfully",
    };
  } catch (err) {
    return {
      type: "error",
      message: "something went wrong",
    };
  }
};
