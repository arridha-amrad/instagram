"use server";

import db from "@/lib/drizzle/db";
import { PostLikesTable } from "@/lib/drizzle/schema";
import { authActionClient } from "@/lib/safe-action";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const actionLikePost = authActionClient
  .schema(
    z.object({
      postId: z.string(),
      pathname: z.string(),
    }),
  )
  .action(async ({ ctx: { userId }, parsedInput: { postId } }) => {
    try {
      const isLiked = await db.query.PostLikesTable.findFirst({
        where: and(
          eq(PostLikesTable.postId, postId),
          eq(PostLikesTable.userId, userId),
        ),
      });
      if (isLiked) {
        await db
          .delete(PostLikesTable)
          .where(
            and(
              eq(PostLikesTable.postId, postId),
              eq(PostLikesTable.userId, userId),
            ),
          );
      } else {
        await db.insert(PostLikesTable).values({
          postId,
          userId,
        });
      }
    } catch (err) {
      throw err;
    }
  });
