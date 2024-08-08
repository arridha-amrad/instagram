import db from "@/lib/drizzle/db";
import { eq, sql } from "drizzle-orm";
import { FollowingsTable, UsersTable } from "../schema";
import { TInfiniteResult, TUserIsFollow } from "./type";
import { unstable_cache } from "next/cache";

type Args = {
  username: string;
  authUserId?: string;
  page?: number;
  date?: Date;
};

const LIMIT = 10;

const fetchFollowings = async ({
  username,
  authUserId,
  page = 1,
  date = new Date(),
}: Args): Promise<TInfiniteResult<TUserIsFollow>> => {
  //
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
  });

  const data: TUserIsFollow[] = users.map(({ follow: f }) => {
    const usr = {
      ...f,
      isFollow: !!f.followers.find(
        (x) => x.userId === authUserId && x.followId === f.id,
      ),
    };
    const { followers, ...props } = usr;
    return props;
  });

  return {
    page,
    total: result.total,
    data,
    date,
  };
};

export const fetchUserFollowings = unstable_cache(
  fetchFollowings,
  ["fetchUserFollowings"],
  { tags: ["fetchUserFollowings"] },
);
