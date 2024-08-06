import { and, eq } from "drizzle-orm";
import db from "../db";
import { PostLikesTable } from "../schema";

type Args = {
  postId: string;
  userId: string;
};

export const likePost = async ({ postId, userId }: Args) => {
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
};
