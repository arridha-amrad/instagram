import { eq } from "drizzle-orm";
import db from "../db";
import { UserInfoTable, UsersTable } from "../schema";

type Params = {
  name: string;
  authUserId: string;
  bio?: string;
  gender?: string;
  occupation?: string;
  website?: string;
};

export const updateProfile = async ({
  authUserId,
  name,
  bio,
  gender,
  occupation,
  website,
}: Params) => {
  const response = await db.transaction(async (tx) => {
    const [result] = await tx
      .update(UsersTable)
      .set({
        name,
      })
      .where(eq(UsersTable.id, authUserId))
      .returning({
        name: UsersTable.name,
      });
    await tx
      .insert(UserInfoTable)
      .values({
        userId: authUserId,
        bio,
        gender: gender === "female" ? "female" : "male",
        occupation,
        website,
      })
      .onConflictDoUpdate({
        target: UserInfoTable.userId,
        set: {
          userId: authUserId,
          bio,
          gender: gender === "female" ? "female" : "male",
          occupation,
          website,
        },
      });
    return result;
  });

  return response;
};
