"use server";

import db from "@/lib/drizzle/db";
import { CommentLikesTable } from "@/lib/drizzle/schema";
import { authActionClient } from "@/lib/safe-action";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
  pathname: z.string(),
  commentId: z.string(),
});

export const likeCommentAction = authActionClient
  .schema(schema)
  .action(async ({ ctx: { userId }, parsedInput: { commentId } }) => {
    try {
      const [isLiked] = await db
        .select()
        .from(CommentLikesTable)
        .where(
          and(
            eq(CommentLikesTable.userId, userId),
            eq(CommentLikesTable.commentId, commentId),
          ),
        );
      if (isLiked) {
        await db
          .delete(CommentLikesTable)
          .where(
            and(
              eq(CommentLikesTable.userId, userId),
              eq(CommentLikesTable.commentId, commentId),
            ),
          );
      } else {
        await db.insert(CommentLikesTable).values({
          commentId,
          userId,
        });
      }
    } catch (err) {
      throw err;
    }
  });
