import { eq } from "drizzle-orm";
import db from "../db";
import { UsersTable } from "../schema";
import { CustomServerError } from "@/helpers/CustomServerError";

type Params = {
  currentUsername: string;
  newUsername: string;
  authUserId: string;
};

export const changeUsername = async ({
  authUserId,
  currentUsername,
  newUsername,
}: Params) => {
  const user = await db.query.UsersTable.findFirst({
    columns: {
      id: true,
      name: true,
      username: true,
      avatar: true,
    },
    where: eq(UsersTable.id, authUserId),
  });
  if (!user) {
    throw new CustomServerError("User not found");
  }
  const isMatch = user.username === currentUsername;
  if (!isMatch) {
    throw new CustomServerError("Wrong username");
  }
  const [result] = await db
    .update(UsersTable)
    .set({
      username: newUsername,
    })
    .where(eq(UsersTable.id, authUserId))
    .returning({
      username: UsersTable.username,
    });

  return result;
};
