import db from "@/lib/drizzle/db";
import { and, eq, sql } from "drizzle-orm";
import { FollowingsTable, UsersTable } from "@/lib/drizzle/schema";
import { TInfiniteResult, TUserIsFollow } from "./type";
import { unstable_cache } from "next/cache";

type Args = {
  username: string;
  authUserId?: string;
  page?: number;
  date?: Date;
};

const LIMIT = 10;

export const fetchFollowers = async ({
  authUserId,
  username,
  page = 1,
  date = new Date(),
}: Args): Promise<TInfiniteResult<TUserIsFollow>> => {
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

  const [result] = await db
    .select({
      total: sql<number>`cast(count(${FollowingsTable.followId}) as int)`,
    })
    .from(FollowingsTable)
    .where(and(eq(FollowingsTable.followId, user.id)));

  const followers = await db.query.FollowingsTable.findMany({
    columns: {},
    limit: LIMIT,
    offset: LIMIT * (page - 1),
    with: {
      user: {
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
    where(fields, { eq }) {
      return eq(fields.followId, user.id);
    },
  });

  console.log(JSON.stringify(followers, null, 2));

  const populatedFollowers: TUserIsFollow[] = followers.map(({ user: u }) => {
    const usr = {
      ...u,
      isFollow: !!u.followers.find(
        (x) => x.followId === authUserId && x.userId === u.id,
      ),
    };
    const { followers, ...props } = usr;
    return props;
  });

  return {
    data: populatedFollowers,
    total: result.total,
    page,
    date,
  };
};

export const fetchUserFollowers = unstable_cache(
  fetchFollowers,
  ["fetchUserFollowers"],
  { tags: ["fetchUserFollowers"] },
);
