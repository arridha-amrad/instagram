import { eq } from "drizzle-orm";
import db from "../db";
import { UsersTable } from "../schema";
import { verify, hash } from "argon2";
import { CustomServerError } from "@/helpers/CustomServerError";

type Params = {
  authUserId: string;
  oldPassword: string;
  newPassword: string;
};

export const changePassword = async ({
  authUserId,
  newPassword,
  oldPassword,
}: Params) => {
  const user = await db.query.UsersTable.findFirst({
    where: eq(UsersTable.id, authUserId),
  });
  if (!user) {
    throw new CustomServerError("User not found");
  }
  if (!user.password) {
    throw new CustomServerError(
      "Your account is created using different provider",
    );
  }
  const isMatch = await verify(user.password, oldPassword);
  if (!isMatch) {
    throw new CustomServerError("Wrong password");
  }
  const hashedPassword = await hash(newPassword);
  await db
    .update(UsersTable)
    .set({
      password: hashedPassword,
    })
    .where(eq(UsersTable.id, authUserId));
};
