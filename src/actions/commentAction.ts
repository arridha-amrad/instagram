"use server";

import db from "@/lib/drizzle/db";
import { CommentsTable, RepliesTable } from "@/lib/drizzle/schema";
import { authActionClient } from "@/lib/safe-action";
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

const commentSchema = zfd.formData({
  message: zfd.text(z.string()),
});

export const commentAction = authActionClient
  .schema(commentSchema)
  .bindArgsSchemas<
    [commentId: z.ZodNullable<z.ZodString>, postId: z.ZodNullable<z.ZodString>]
  >([z.string().nullable(), z.string().nullable()])
  .action(
    async ({
      ctx: { userId },
      bindArgsParsedInputs: [commentId, postId],
      parsedInput: { message },
    }) => {
      try {
        // if no commentId passed it will create comment otherwise create reply
        if (!commentId) {
          if (!postId) return;
          const response = await createComment({
            message: message,
            postId,
            userId,
          });
          return {
            comment: response,
          };
        } else {
          const response = await createReply({
            commentId,
            message: message,
            userId,
          });
          return {
            reply: response,
          };
        }
      } catch (err) {
        throw err;
      }
    },
  );
