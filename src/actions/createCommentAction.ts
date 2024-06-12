"use server";

import db from "@/lib/drizzle/db";
import { CommentsTable, RepliesTable } from "@/lib/drizzle/schema";
import { commentSchema } from "@/lib/zod/createCommentSchema";

export type TCommentSchema = typeof CommentsTable.$inferSelect;
export type TReplySchema = typeof RepliesTable.$inferSelect;

export const createCommentAction = async (
  prevState: any,
  formData: FormData
) => {
  const { userId, postId, message, commentId } = Object.fromEntries(
    formData.entries()
  ) as {
    userId: string;
    postId: string;
    message: string;
    commentId: string | null;
  };

  const validatedFields = commentSchema.safeParse({
    message,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    if (!commentId) {
      console.log("create comment");
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
        content: "comment",
        message: "New comment added",
        data: response as TCommentSchema,
      };
    }
    const [response] = await db
      .insert(RepliesTable)
      .values({
        commentId,
        message,
        userId,
      })
      .returning();

    return {
      type: "success",
      content: "reply",
      message: "New comment added",
      data: response as TReplySchema,
    };
  } catch (err) {
    return {
      type: "error",
      message: "Something went wrong",
    };
  }
};
