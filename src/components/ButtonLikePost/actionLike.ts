"use server";

import db from "@/lib/drizzle/db";
import { PostLikesTable } from "@/lib/drizzle/schema";
import { actionClient } from "@/lib/safe-action";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
  userId: z.string(),
  postId: z.string(),
});

export const likePostAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { userId, postId } }) => {
    try {
      let message = "";
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
        message = "dislike";
      } else {
        await db.insert(PostLikesTable).values({
          postId,
          userId,
        });
        message = "like";
      }
      return {
        message: message,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  });
