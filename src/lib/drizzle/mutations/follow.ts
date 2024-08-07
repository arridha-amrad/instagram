import { and, eq } from "drizzle-orm";
import db from "../db";
import { FollowingsTable } from "../schema";

export const follow = async ({
  authUserId,
  followId,
}: {
  authUserId: string;
  followId: string;
}) => {
  const isFollow = await db.query.FollowingsTable.findFirst({
    where(fields, { and, eq }) {
      return and(eq(fields.followId, followId), eq(fields.userId, authUserId));
    },
  });

  let message: "follow" | "unfollow" = "follow";
  if (!isFollow) {
    await db
      .insert(FollowingsTable)
      .values({ followId: followId, userId: authUserId });
  } else {
    message = "unfollow";
    await db
      .delete(FollowingsTable)
      .where(
        and(
          eq(FollowingsTable.followId, followId),
          eq(FollowingsTable.userId, authUserId),
        ),
      );
  }
  return message;
};
