import db from "@/lib/drizzle/db";
import { eq, sql } from "drizzle-orm";
import { FollowingsTable, UsersTable } from "@/lib/drizzle/schema";
import { TInfiniteResult, TOwnerIsFollow } from "./type";

type Args = {
  username: string;
  authUserId?: string;
  page?: number;
};

const LIMIT = 10;

export const fetchUserFollowers = async ({
  authUserId,
  username,
  page = 1,
}: Args): Promise<TInfiniteResult<TOwnerIsFollow>> => {
  const user = await db.query.UsersTable.findFirst({
    where: eq(UsersTable.username, username),
  });

  if (!user) {
    return {
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
    .where(eq(FollowingsTable.followId, user.id));

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

  const populatedUsers: TOwnerIsFollow[] = followers
    .map(({ user: f }) => {
      const user = {
        ...f,
        isFollow: !!f.followers.find(
          (x) => x.followId === user.id && x.userId === authUserId,
        ),
      };
      return user;
    })

    .then((result) => {
      const data = result.map(({ user }) => {
        const a = {
          ...user,
          isFollow: !!user.followers.find(
            (f) => f.followId === user.id && f.userId === authUserId,
          ),
        };
        const { followers, ...rest } = a;
        return rest;
      });
      return data;
    });

  return {
    data: followers,
    total: result.total,
    page,
  };
};
