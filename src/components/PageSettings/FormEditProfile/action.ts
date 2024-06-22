"use server";

import db from "@/lib/drizzle/db";
import { editProfileSchema } from "./schema";
import { UserInfoTable, UsersTable } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

type Data = {
  name: string;
  website: string | null;
  occupation: string | null;
  bio: string | null;
  gender: string | null;
};

export const editProfile = async (
  { userId }: { userId: string },
  prevState: any,
  formData: FormData,
) => {
  const { bio, gender, name, occupation, website } = Object.fromEntries(
    formData.entries(),
  ) as Data;

  const response = await db.transaction(async (tx) => {
    const [result] = await tx
      .update(UsersTable)
      .set({
        name,
      })
      .where(eq(UsersTable.id, userId))
      .returning({
        name: UsersTable.name,
      });

    await tx
      .insert(UserInfoTable)
      .values({
        userId,
        bio,
        gender: gender === "female" ? "female" : "male",
        occupation,
        website,
      })
      .onConflictDoUpdate({
        target: UserInfoTable.userId,
        set: {
          userId,
          bio,
          gender: gender === "female" ? "female" : "male",
          occupation,
          website,
        },
      });

    return result;
  });

  revalidateTag("fetch-user");

  return {
    type: "success",
    message: "Profile updated",
    data: response,
  };
};
