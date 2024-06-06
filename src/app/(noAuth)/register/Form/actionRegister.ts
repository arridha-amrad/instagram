"use server";

import db from "@/lib/drizzle/db";
import { registrationSchema } from "./validationRegister";
import { UsersTable } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import argon from "argon2";

export const registerAction = async (prevState: any, formData: FormData) => {
  const { name, email, username, password } = Object.fromEntries(
    formData.entries()
  );
  const validatedFields = registrationSchema.safeParse({
    name,
    email,
    username,
    password,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email: e, name: n, password: p, username: u } = validatedFields.data;

  const [userWithSameEmail] = await db
    .select()
    .from(UsersTable)
    .where(eq(UsersTable.email, e));

  if (userWithSameEmail) {
    return {
      type: "error",
      message: "Email is already taken",
    };
  }

  const [userWithSameUsername] = await db
    .select()
    .from(UsersTable)
    .where(eq(UsersTable.username, u));

  if (userWithSameUsername) {
    return {
      type: "error",
      message: "Username is already taken",
    };
  }

  const hashedPassword = await argon.hash(p);

  await db.insert(UsersTable).values({
    email: e,
    name: n,
    provider: "credentials",
    username: u,
    password: hashedPassword,
  });

  return {
    message: "Registration is successful",
    type: "success",
  };
};
