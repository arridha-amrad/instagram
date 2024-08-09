import { CustomServerError } from "@/lib/next-safe-action/init";
import { hash } from "argon2";
import { eq } from "drizzle-orm";
import db from "../db";
import { UsersTable } from "../schema";

type Param = Required<
  Pick<
    typeof UsersTable.$inferInsert,
    "email" | "name" | "password" | "username"
  >
>;

export const registerUser = async ({
  email,
  name,
  username,
  password,
}: Param) => {
  //
  if (!password) {
    throw new CustomServerError("password cannot be null");
  }

  const [userWithSameEmail] = await db
    .select()
    .from(UsersTable)
    .where(eq(UsersTable.email, email));

  if (userWithSameEmail) {
    throw new CustomServerError("Email is already taken");
  }

  const [userWithSameUsername] = await db
    .select()
    .from(UsersTable)
    .where(eq(UsersTable.username, username));

  if (userWithSameUsername) {
    throw new CustomServerError("Username is already taken");
  }

  const hashedPassword = await hash(password);

  await db.insert(UsersTable).values({
    email,
    name,
    provider: "credentials",
    username,
    password: hashedPassword,
  });
};
