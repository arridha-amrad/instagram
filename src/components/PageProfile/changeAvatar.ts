"use server";

import { upload } from "@/lib/cloudinary";
import db from "@/lib/drizzle/db";
import { UsersTable } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export const changeAvatar = async (
  userId: string,
  prevState: any,
  formData: FormData,
) => {
  const data = formData.get("image") as File;
  console.log(data);
  console.log({ userId });
  try {
    const response = await upload(data, true);
    const [result] = await db
      .update(UsersTable)
      .set({
        avatar: response.secure_url,
      })
      .where(eq(UsersTable.id, userId))
      .returning({
        id: UsersTable.id,
        name: UsersTable.name,
        image: UsersTable.avatar,
        username: UsersTable.username,
        email: UsersTable.email,
      });
    revalidateTag("fetch-user");
    return {
      type: "success",
      message: "",
      data: result,
    };
  } catch (err) {
    console.log(err);
    return {
      type: "error",
      message: "Something went wrong",
    };
  }
};
