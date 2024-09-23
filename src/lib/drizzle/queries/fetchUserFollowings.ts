import db from "@/lib/drizzle/db";
import { eq, sql } from "drizzle-orm";
import { FollowingsTable, UsersTable } from "../schema";
import { TInfiniteResult } from "./type";
import { unstable_cache } from "next/cache";

type Args = {
  username: string;
  authUserId?: string;
  page?: number;
  date?: Date;
};

const queryTotal = async (userId: string) => {
  const [result] = await db
    .select({
      sum: sql<number>`
        CAST(COUNT(${FollowingsTable}) AS Int)
      `,
    })
    .from(FollowingsTable)
    .where(eq(FollowingsTable.userId, userId));
  return result.sum;
};

const query = async (userId: string, authUserId?: string) => {
  return db
    .select({
      id: UsersTable.id,
      username: UsersTable.username,
      avatar: UsersTable.avatar,
      name: UsersTable.name,
      isFollow: sql<boolean>`
        CASE WHEN EXISTS (
          SELECT 1
          FROM ${FollowingsTable}
          WHERE ${FollowingsTable.userId} = ${authUserId}
          AND ${FollowingsTable.followId} = ${UsersTable.id}
        )
      `,
    })
    .from(FollowingsTable)
    .innerJoin(UsersTable, eq(FollowingsTable.followId, UsersTable.id))
    .where(eq(FollowingsTable.userId, userId));
};

export type TFollowing = Awaited<ReturnType<typeof query>>[number];

const fetchFollowings = async ({
  username,
  authUserId,
  page = 1,
  date = new Date(),
}: Args): Promise<TInfiniteResult<TFollowing>> => {
  const user = await db.query.UsersTable.findFirst({
    where: eq(UsersTable.username, username),
  });
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
    page,
    total,
    data,
    date,
  };
};

export const fetchUserFollowings = unstable_cache(
  fetchFollowings,
  ["fetchUserFollowings"],
  { tags: ["fetchUserFollowings"] },
);
