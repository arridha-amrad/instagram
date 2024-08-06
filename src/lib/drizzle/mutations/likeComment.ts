import { and, eq } from "drizzle-orm";
import db from "../db";
import { CommentLikesTable } from "../schema";

type Args = {
  authUserId: string;
  commentId: string;
};

export const likeComment = async ({ authUserId, commentId }: Args) => {
  const [isLiked] = await db
    .select()
    .from(CommentLikesTable)
    .where(
      and(
        eq(CommentLikesTable.userId, authUserId),
        eq(CommentLikesTable.commentId, commentId),
      ),
    );
  if (isLiked) {
    await db
      .delete(CommentLikesTable)
      .where(
        and(
          eq(CommentLikesTable.userId, authUserId),
          eq(CommentLikesTable.commentId, commentId),
        ),
      );
  } else {
    await db.insert(CommentLikesTable).values({
      commentId,
      userId: authUserId,
    });
  }
};
