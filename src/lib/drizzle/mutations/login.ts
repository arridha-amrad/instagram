import { CustomServerError } from "@/helpers/CustomServerError";
import { verify } from "argon2";
import { eq } from "drizzle-orm";
import { User } from "next-auth";
import db from "../db";
import { UsersTable } from "../schema";

type Params = {
  identity: string;
  password: string;
};

export const login = async ({ identity, password }: Params) => {
  const [dbUser] = await db
    .select()
    .from(UsersTable)
    .where(
      identity.includes("@")
        ? eq(UsersTable.email, identity)
        : eq(UsersTable.username, identity),
    );

  if (!dbUser) {
    throw new CustomServerError("User not found");
  }

  if (!dbUser.password) {
    throw new CustomServerError("invalid credentials");
  }

  const isMatch = await verify(dbUser.password, password);

  if (!isMatch) {
    throw new CustomServerError("Wrong password");
  }

  const myUser: User = {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    image: dbUser.avatar,
    username: dbUser.username,
  };

  return myUser;
};
