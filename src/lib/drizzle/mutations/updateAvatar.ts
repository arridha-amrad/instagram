import { upload } from "@/lib/cloudinary";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import db from "../db";
import { UsersTable } from "../schema";

type Param = {
  image: File;
  authUserId: string;
};

export const updatedAvatar = async ({ authUserId, image }: Param) => {
  const response = await upload(image, true);
  const [result] = await db
    .update(UsersTable)
    .set({
      avatar: response.secure_url,
    })
    .where(eq(UsersTable.id, authUserId))
    .returning({
      id: UsersTable.id,
      name: UsersTable.name,
      image: UsersTable.avatar,
      username: UsersTable.username,
    });
  revalidateTag("fetch-user");
  return result;
};
