"use server";

import { db } from "@/lib/drizzle/db";
import { TInfiniteResult } from "../type";
import { FollowingsTable, PostLikesTable, UsersTable } from "../../schema";
import { eq, sql } from "drizzle-orm";

const LIMIT = 10;

type Args = {
  postId: string;
  authUserId?: string;
  page?: number;
  date?: Date;
};

const querySumLikes = async (postId: string) => {
  const [result] = await db
    .select({
      sum: sql<number>`
        CAST(COUNT(${PostLikesTable}) AS Int)
      `,
    })
    .from(PostLikesTable)
    .where(eq(PostLikesTable.postId, postId));
  return result.sum;
};

const queryUsers = async (postId: string, authUserId?: string) => {
  return db
    .select({
      id: UsersTable.id,
      name: UsersTable.name,
      avatar: UsersTable.avatar,
      username: UsersTable.username,
      isFollow: sql<boolean>`
      CASE WHEN EXISTS (
        SELECT 1 FROM ${FollowingsTable}
        WHERE ${FollowingsTable.userId} = ${authUserId}
        AND ${FollowingsTable.followId} = ${UsersTable.id}
      ) THEN true
        ELSE false
      END
    `,
    })
    .from(PostLikesTable)
    .where(eq(PostLikesTable.postId, postId))
    .innerJoin(UsersTable, eq(PostLikesTable.userId, UsersTable.id))
    .limit(LIMIT);
};

export type TLikeUsers = Awaited<ReturnType<typeof queryUsers>>[number];

export const fetchPostLikes = async ({
  postId,
  authUserId,
  page = 1,
  date = new Date(),
}: Args): Promise<TInfiniteResult<TLikeUsers>> => {
  //
  const total = await querySumLikes(postId);
  const users = await queryUsers(postId, authUserId);

  return {
    date,
    data: users,
    page,
    total,
  };
};
