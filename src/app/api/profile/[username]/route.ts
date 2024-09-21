import db from "@/lib/drizzle/db";
import {
  FollowingsTable,
  PostLikesTable,
  PostsTable,
  UserInfoTable,
  UsersTable,
} from "@/lib/drizzle/schema";
import {
  aliasedTable,
  and,
  count,
  countDistinct,
  desc,
  eq,
  sql,
} from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { NextResponse } from "next/server";

type Params = { params: { username: string } };

export const GET = async (req: Request, { params }: Params) => {
  const username = params.username;

  const flr = aliasedTable(FollowingsTable, "followers");
  const flw = aliasedTable(FollowingsTable, "followings");

  const [user] = await db
    .select({
      id: UsersTable.id,
      username: UsersTable.username,
      name: UsersTable.name,
      avatar: UsersTable.avatar,
      email: UsersTable.email,
      bio: UserInfoTable.bio,
      gender: UserInfoTable.gender,
      occupation: UserInfoTable.occupation,
      website: UserInfoTable.website,
      sumPosts: countDistinct(PostsTable.id),
      sumFollowers: countDistinct(flr),
      sumFollowings: countDistinct(flw),
    })
    .from(UsersTable)
    .where(eq(UsersTable.username, username))
    .leftJoin(UserInfoTable, eq(UsersTable.id, UserInfoTable.userId))
    .leftJoin(PostsTable, eq(UsersTable.id, PostsTable.userId))
    .leftJoin(flr, eq(UsersTable.id, flr.followId))
    .leftJoin(flw, eq(UsersTable.id, flw.userId))
    .groupBy(UsersTable.id, UserInfoTable.id);

  const followers = await db
    .select({
      id: UsersTable.id,
      username: UsersTable.username,
      name: UsersTable.name,
      avatar: UsersTable.avatar,
      totalFollowers: countDistinct(flr),
      isFollow: sql<boolean>`
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM followings_table ft
            WHERE ft.follow_id = ${UsersTable.id}
            AND ft.user_id = ${user.id}
          )
          THEN true
          ELSE false
        END
      `,
    })
    .from(FollowingsTable)
    .orderBy(desc(countDistinct(flr)))
    .innerJoin(UsersTable, eq(FollowingsTable.userId, UsersTable.id))
    .leftJoin(flr, eq(UsersTable.id, flr.followId))
    .where(eq(FollowingsTable.followId, user.id))
    .groupBy(UsersTable.id);

  return NextResponse.json({ user, followers }, { status: 200 });
};
