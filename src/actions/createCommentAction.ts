"use server";

import db from "@/lib/drizzle/db";
import { CommentsTable } from "@/lib/drizzle/schema";
import { commentSchema } from "@/lib/zod/createCommentSchema";

export const createCommentAction = async (
  prevState: any,
  formData: FormData
) => {
  const { userId, postId, message } = Object.fromEntries(
    formData.entries()
  ) as {
    userId: string;
    postId: string;
    message: string;
  };

  const validatedFields = commentSchema.safeParse({
    message,
  });

  console.log({ message });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const [response] = await db
      .insert(CommentsTable)
      .values({
        postId,
        userId,
        message: validatedFields.data.message,
      })
      .returning();

    return {
      type: "success",
      message: "New comment added",
      data: response,
    };
  } catch (err) {
    return {
      type: "error",
      message: "Something went wrong",
    };
  }
};
