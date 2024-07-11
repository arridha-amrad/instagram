"use server";

import db from "@/lib/drizzle/db";
import { ReplyLikesTable } from "@/lib/drizzle/schema";
import { authActionClient, CustomServerError } from "@/lib/safe-action";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
  replyId: z.string(),
});

export const likeReplyAction = authActionClient
  .schema(schema)
  .action(async ({ ctx: { userId }, parsedInput: { replyId } }) => {
    try {
      const isLiked = await db.query.ReplyLikesTable.findFirst({
        where({ userId: uid, replyId: rId }, { and, eq }) {
          return and(eq(uid, userId), eq(rId, replyId));
        },
      });
      if (isLiked) {
        await db
          .delete(ReplyLikesTable)
          .where(
            and(
              eq(ReplyLikesTable.replyId, replyId),
              eq(ReplyLikesTable.userId, userId),
            ),
          );
      } else {
        await db.insert(ReplyLikesTable).values({
          replyId,
          userId,
        });
      }
      return {
        message: "success",
      };
    } catch (err) {
      throw new CustomServerError("Something went wrong");
    }
  });
