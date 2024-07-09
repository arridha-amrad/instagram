"use server";

import db from "@/lib/drizzle/db";
import { CommentLikesTable } from "@/lib/drizzle/schema";
import { actionClient } from "@/lib/safe-action";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  userId: z.string(),
  commentId: z.string(),
});

export const likeCommentAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { userId, commentId } }) => {
    if (userId === "") {
      redirect("/login");
    }
    console.log({ userId, commentId });
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
  });
