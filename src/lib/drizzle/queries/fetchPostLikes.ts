import db from "@/lib/drizzle/db";
import { TInfiniteResult, TUserIsFollow } from "./type";
import { PostLikesTable } from "../schema";
import { eq, sql } from "drizzle-orm";

const fetchMyFollowingIds = async (authUserId: string) => {
  if (authUserId === "") return [];
  const data = await db.query.FollowingsTable.findMany({
    where(fields, operators) {
      return operators.eq(fields.userId, authUserId);
    },
  });

  const followings = data.map(({ followId }) => followId);
  return followings;
};

type Args = {
  postId: string;
  authUserId?: string;
  page?: number;
  date?: Date;
};

export const fetchPostLikes = async ({
  postId,
  authUserId,
  page = 1,
  date = new Date(),
}: Args): Promise<TInfiniteResult<TUserIsFollow>> => {
  //
  const getTotalLikes = async () => {
    const [result] = await db
      .select({
        sum: sql<number>`cast(count(${PostLikesTable.postId}) as int)`,
      })
      .from(PostLikesTable)
      .where(eq(PostLikesTable.postId, postId));
    return result.sum;
  };

  const getLikes = async () => {
    const likes = await db.query.PostLikesTable.findMany({
      columns: {},
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            avatar: true,
            username: true,
          },
        },
      },
      where({ postId: pId }, { eq, and }) {
        return and(eq(pId, postId));
      },
    });
    return likes;
  };

  const [total, likes, followings] = await Promise.all([
    getTotalLikes(),
    getLikes(),
    fetchMyFollowingIds(authUserId ?? ""),
  ]);

  const populatedUsers = likes.map(({ user }) => {
    const usr = {
      ...user,
      isFollow: !!followings.find((f) => f === user.id),
    };
    return usr;
  });

  return {
    date,
    data: populatedUsers,
    page,
    total,
  };
};
