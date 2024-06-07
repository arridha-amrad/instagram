"use server";

import db from "@/lib/drizzle/db";
import { loginSchema } from "./loginSchema";
import { UsersTable } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import argon from "argon2";
import { signIn } from "@/auth";
import { User } from "next-auth";
import { redirect } from "next/navigation";

export const loginAction = async (prevState: any, formData: FormData) => {
  const { identity, password } = Object.fromEntries(formData.entries());
  const validatedFields = loginSchema.safeParse({
    identity,
    password,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { identity: id, password: pw } = validatedFields.data;

  const [dbUser] = await db
    .select()
    .from(UsersTable)
    .where(
      id.includes("@") ? eq(UsersTable.email, id) : eq(UsersTable.username, id)
    );

  if (!dbUser) {
    return {
      message: "User not found",
      type: "error",
    };
  }

  if (!dbUser.password) {
    return {
      message: "invalid credentials",
      type: "error",
    };
  }

  const isMatch = await argon.verify(dbUser.password, pw);

  if (!isMatch) {
    return {
      message: "Wrong password",
      type: "error",
    };
  }

  const myUser: User = {
    id: dbUser.id.toString(),
    name: dbUser.name,
    email: dbUser.email,
    image: dbUser.avatar,
    username: dbUser.username,
  };

  await signIn("credentials", { ...myUser, redirect: false });
  redirect("/");
};
