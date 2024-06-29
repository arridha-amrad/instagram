"use server";

import { upload } from "@/lib/cloudinary";
import db from "@/lib/drizzle/db";
import { UsersTable } from "@/lib/drizzle/schema";
import { actionClient } from "@/lib/safe-action";
import { eq } from "drizzle-orm";
import { flattenValidationErrors } from "next-safe-action";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

const schema = zfd.formData({
  image: zfd.file(),
});

export const changeAvatarAction = actionClient
  .schema(schema, {
    handleValidationErrorsShape: (ve) => flattenValidationErrors(ve).fieldErrors,
  })
  .bindArgsSchemas<[userId: z.ZodString]>([z.string()])
  .action(async ({ bindArgsParsedInputs: [userId], parsedInput: { image } }) => {
    if (userId === "") {
      return {
        err: "userId is empty",
      };
    }
    try {
      const response = await upload(image, true);
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
        message: "avatar updated",
        data: result,
      };
    } catch (err) {
      throw err;
    }
  });

export const changeAvatar = async (userId: string, prevState: any, formData: FormData) => {
  const data = formData.get("image") as File;
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
