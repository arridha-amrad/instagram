import db from "@/lib/drizzle/db";
import { eq, sql } from "drizzle-orm";
import { FollowingsTable, UsersTable } from "@/lib/drizzle/schema";
import { TInfiniteResult, TUserIsFollow } from "./type";
import { unstable_cache } from "next/cache";

type Args = {
  username: string;
  authUserId?: string;
  page?: number;
  date?: Date;
};

const query = async (userId: string, authUserId?: string) => {
  return db
    .select({
      id: UsersTable.id,
      username: UsersTable.username,
      avatar: UsersTable.avatar,
      name: UsersTable.name,
      isFollow: sql<boolean>`
        CASE WHEN EXIST (
          SELECT 1
          FROM ${FollowingsTable}
          WHERE ${FollowingsTable.userId} = ${authUserId}
          AND ${FollowingsTable.followId} = ${UsersTable.id}
        )
          THEN true
          ELSE false
        END
      `,
    })
    .from(FollowingsTable)
    .where(eq(FollowingsTable.followId, userId))
    .innerJoin(UsersTable, eq(UsersTable.id, FollowingsTable.userId));
};

const queryTotal = async (userId: string) => {
  const [result] = await db
    .select({
      sum: sql<number>`
        CAST(COUNT(${FollowingsTable}) AS Int)
      `,
    })
    .from(FollowingsTable)
    .where(eq(FollowingsTable.followId, userId));
  return result.sum;
};

export const fetchFollowers = async ({
  authUserId,
  username,
  page = 1,
  date = new Date(),
}: Args): Promise<TInfiniteResult<TUserIsFollow>> => {
  const [user] = await db
    .select({
      id: UsersTable.id,
    })
    .from(UsersTable)
    .where(eq(UsersTable.username, username));
  if (!user) {
    return {
      date,
      data: [],
      page: 0,
      total: 0,
    };
  }
  const total = await queryTotal(user.id);
  const data = await query(user.id, authUserId);
  return {
    data,
    total,
    page,
    date,
  };
};

export const fetchUserFollowers = unstable_cache(
  fetchFollowers,
  ["fetchUserFollowers"],
  { tags: ["fetchUserFollowers"] },
);
