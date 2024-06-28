"use server";

import db from "@/lib/drizzle/db";
import { CommentsTable, RepliesTable } from "@/lib/drizzle/schema";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { zfd } from "zod-form-data";

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

const commentSchema = zfd.formData({
  message: zfd.text(z.string()),
});

export const commentAction = actionClient
  .schema(commentSchema)
  .bindArgsSchemas<
    [
      commentId: z.ZodNullable<z.ZodString>,
      postId: z.ZodNullable<z.ZodString>,
      userId: z.ZodString,
    ]
  >([z.string().nullable(), z.string().nullable(), z.string()])
  .action(
    async ({
      bindArgsParsedInputs: [commentId, postId, userId],
      parsedInput: { message },
    }) => {
      try {
        if (!commentId) {
          if (!postId || !userId) {
            return {
              err: "postId and userId are null",
            };
          }
          const response = await createComment({
            message: message,
            postId,
            userId,
          });
          return {
            msgComment: "New comment added",
            data: response,
          };
        } else {
          if (!userId) {
            return {
              err: "userId cannot be null",
            };
          }
          const response = await createReply({
            commentId,
            message: message,
            userId,
          });
          return {
            msgReply: "New reply added",
            data: response,
          };
        }
      } catch (err) {
        throw err;
      }
    },
  );

export const _commentAction = async (
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
