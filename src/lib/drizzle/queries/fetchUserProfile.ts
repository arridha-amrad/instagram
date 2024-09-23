import db from "@/lib/drizzle/db";
import {
  FollowingsTable,
  PostsTable,
  UserInfoTable,
  UsersTable,
} from "@/lib/drizzle/schema";
import { aliasedTable, eq, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import crypto from "crypto";

type Args = {
  username: string;
  authUserId?: string;
};

const followers = aliasedTable(FollowingsTable, "followers");
const followings = aliasedTable(FollowingsTable, "followings");
const query = async (userId: string, authUserId?: string) => {
  return db
    .select({
      id: UsersTable.id,
      username: UsersTable.username,
      name: UsersTable.name,
      avatar: UsersTable.avatar,
      bio: UserInfoTable.bio,
      gender: UserInfoTable.gender,
      occupation: UserInfoTable.occupation,
      website: UserInfoTable.website,
      sumPosts: sql<number>`
        CAST(COUNT(DISTINCT ${PostsTable.id}) AS Int)
      `,
      sumFollowers: sql<number>`
        CAST(COUNT(DISTINCT ${followers}) AS Int)
      `,
      sumFollowings: sql<number>`
        CAST(COUNT(DISTINCT${followings}) AS Int)
      `,
      isFollowed: sql<boolean>`
        CASE WHEN EXISTS(
          SELECT 1
          FROM ${FollowingsTable}
          WHERE ${FollowingsTable.followId} = ${UsersTable.id}
          AND ${FollowingsTable.userId} = ${authUserId}
        )
          THEN true
          ELSE false
        END
      `,
    })
    .from(UsersTable)
    .where(eq(UsersTable.id, userId))
    .innerJoin(UserInfoTable, eq(UserInfoTable.userId, UsersTable.id))
    .leftJoin(followings, eq(followings.userId, UsersTable.id))
    .leftJoin(PostsTable, eq(PostsTable.userId, UsersTable.id))
    .leftJoin(followers, eq(followers.followId, UsersTable.id))
    .groupBy(UsersTable.id, UserInfoTable.id);
};

export type TProfile = Awaited<ReturnType<typeof query>>[number];

const getProfile = async ({ username, authUserId }: Args) => {
  const [user] = await db
    .select({ id: UsersTable.id })
    .from(UsersTable)
    .where(eq(UsersTable.username, username));
  if (!authUserId) {
    authUserId = crypto.randomUUID();
  }
  const data = await query(user.id, authUserId);
  return data;
};

export const fetchUserProfile = unstable_cache(
  getProfile,
  ["fetchUserProfile"],
  {
    tags: ["fetchUserProfile"],
  },
);
