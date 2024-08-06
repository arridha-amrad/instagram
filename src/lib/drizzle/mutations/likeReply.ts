import { and, eq } from "drizzle-orm";
import db from "../db";
import { ReplyLikesTable } from "../schema";

type Args = {
  authUserId: string;
  replyId: string;
};

export const likeReply = async ({ authUserId, replyId }: Args) => {
  const isLiked = await db.query.ReplyLikesTable.findFirst({
    where({ userId: uid, replyId: rId }, { and, eq }) {
      return and(eq(uid, authUserId), eq(rId, replyId));
    },
  });
  if (isLiked) {
    await db
      .delete(ReplyLikesTable)
      .where(
        and(
          eq(ReplyLikesTable.replyId, replyId),
          eq(ReplyLikesTable.userId, authUserId),
        ),
      );
  } else {
    await db.insert(ReplyLikesTable).values({
      replyId,
      userId: authUserId,
    });
  }
};
