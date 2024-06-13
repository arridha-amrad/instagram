"use server";

import db from "@/lib/drizzle/db";
import { CommentsTable, RepliesTable } from "@/lib/drizzle/schema";
import { commentSchema } from "@/lib/zod/createCommentSchema";

const createComment = async (args: typeof CommentsTable.$inferInsert) => {
  const [response] = await db.insert(CommentsTable).values(args).returning();
  return response;
};

const createReply = async (args: typeof RepliesTable.$inferInsert) => {
  const [response] = await db.insert(RepliesTable).values(args).returning();
  return response;
};

type TCommentAction = {
  userId?: string;
  postId?: string;
  commentId?: string;
};

export const commentAction = async (
  { commentId, postId, userId }: TCommentAction,
  prevState: any,
  formData: FormData,
) => {
  const { message } = Object.fromEntries(formData.entries()) as {
    message: string;
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
      if (!postId || !userId) throw new Error("in complete arguments");
      const response = await createComment({
        message: validatedFields.data.message,
        postId,
        userId,
      });
      return {
        type: "success",
        content: "comment",
        message: "New comment added",
        data: response,
      };
    } else {
      if (!userId) throw new Error("in complete arguments");
      const response = await createReply({
        commentId,
        message: validatedFields.data.message,
        userId,
      });
      return {
        type: "success",
        content: "reply",
        message: "New comment added",
        data: response,
      };
    }
  } catch (err) {
    return {
      type: "error",
      message: "Something went wrong",
    };
  }
};
