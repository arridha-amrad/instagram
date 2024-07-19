import db from "@/lib/drizzle/db";
import { eq, sql } from "drizzle-orm";
import { FollowingsTable, UsersTable } from "../schema";
import { TInfiniteResult, TOwnerIsFollow } from "./type";
import { unstable_cache } from "next/cache";

type Args = {
  username: string;
  authUserId?: string;
  page?: number;
};

const LIMIT = 10;

const fetchFollowings = async ({
  username,
  authUserId,
  page = 1,
}: Args): Promise<TInfiniteResult<TOwnerIsFollow[]>> => {
  const user = await db.query.UsersTable.findFirst({
    where: eq(UsersTable.username, username),
  });

  if (!user) {
    return {
      users: [],
      page: 0,
      total: 0,
    };
  }

  const [result] = await db
    .select({
      total: sql<number>`cast(count(${FollowingsTable.followId}) as int)`,
    })
    .from(FollowingsTable)
    .where(eq(FollowingsTable.userId, user.id));

  const users = await db.query.FollowingsTable.findMany({
    columns: {},
    limit: LIMIT,
    offset: LIMIT * (page - 1),
    with: {
      follow: {
        with: {
          followers: true,
        },
        columns: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
    },
    where(fields, operators) {
      return operators.eq(fields.userId, user.id);
    },
  }).then((result) => {
    const data = result.map(({ follow }) => {
      const a = {
        ...follow,
        isFollow: !!follow.followers.find(
          (f) => f.userId === authUserId && f.followId === follow.id,
        ),
      };
      const { followers, ...rest } = a;
      return rest;
    });
    return data;
  });

  return {
    page,
    total: result.total,
    users,
  };
};

export const fetchUserFollowings = unstable_cache(
  fetchFollowings,
  ["fetchUserFollowings"],
  { tags: ["fetchUserFollowings"] },
);
