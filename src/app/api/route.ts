import db from "@/lib/drizzle/db";
import {
  CommentsTable,
  FollowingsTable,
  PostLikesTable,
  PostsTable,
  RepliesTable,
  SearchUsersTable,
  UserInfoTable,
  UsersTable,
} from "@/lib/drizzle/schema";
import { aliasedTable, and, desc, eq, lt, lte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import crypto from "crypto";

const followers = aliasedTable(FollowingsTable, "followers");
const followings = aliasedTable(FollowingsTable, "followings");

// const query = async (userId: string, authUserId?: string) => {
//   console.log({ query: { userId, authUserId } });

//   return db
//     .select({
//       id: UsersTable.id,
//       username: UsersTable.username,
//       name: UsersTable.name,
//       avatar: UsersTable.avatar,
//       bio: UserInfoTable.bio,
//       gender: UserInfoTable.gender,
//       occupation: UserInfoTable.occupation,
//       website: UserInfoTable.website,
//       sumPosts: sql<number>`
//         CAST(COUNT(DISTINCT ${PostsTable.id}) AS Int)
//       `,
//       sumFollowers: sql<number>`
//         CAST(COUNT(DISTINCT ${followers}) AS Int)
//       `,
//       sumFollowings: sql<number>`
//         CAST(COUNT(DISTINCT${followings}) AS Int)
//       `,
//       isFollowed: sql<boolean>`
//         CASE WHEN EXISTS(
//           SELECT 1
//           FROM ${FollowingsTable}
//           WHERE ${FollowingsTable.followId} = ${UsersTable.id}
//           AND ${FollowingsTable.userId} = ${authUserId}
//         )
//           THEN true
//           ELSE false
//         END
//       `,
//     })
//     .from(UsersTable)
//     .where(eq(UsersTable.id, userId))
//     .leftJoin(UserInfoTable, eq(UserInfoTable.userId, UsersTable.id))
//     .leftJoin(followings, eq(followings.userId, UsersTable.id))
//     .leftJoin(PostsTable, eq(PostsTable.userId, UsersTable.id))
//     .leftJoin(followers, eq(followers.followId, UsersTable.id))
//     .groupBy(
//       UsersTable.id,
//       UserInfoTable.bio,
//       UserInfoTable.gender,
//       UserInfoTable.occupation,
//       UserInfoTable.website,
//     );
// };

const query = async (userId: string, date: Date) => {
  return db
    .select({
      id: PostsTable.id,
      urls: PostsTable.urls,
      createdAt: PostsTable.createdAt,
      sumLikes: sql<number>`
        CAST(COUNT(${PostLikesTable}) AS Int)
      `,
      sumComments: sql<number>`
        CAST(COUNT(${RepliesTable.id}) AS Int) +
        CAST(COUNT(${CommentsTable.id}) AS Int)
      `,
    })
    .from(PostsTable)
    .where(and(eq(PostsTable.userId, userId), lt(PostsTable.createdAt, date)))
    .leftJoin(PostLikesTable, eq(PostsTable.id, PostLikesTable.postId))
    .leftJoin(CommentsTable, eq(CommentsTable.postId, PostsTable.id))
    .leftJoin(RepliesTable, eq(RepliesTable.commentId, CommentsTable.id))
    .orderBy(desc(PostsTable.createdAt))
    .groupBy(PostsTable.id)
    .limit(6);
};

export const GET = async (req: Request) => {
  const date = new Date("2024-06-29T06:25:31.207Z");
  const userId = "4f70c468-ea07-4396-a6c0-609948f48e69";
  // let authUserId;
  // if (!authUserId) {
  //   authUserId = crypto.randomUUID();
  // }
  // let uuid = crypto.randomUUID();
  const user = await query(userId, date);
  return NextResponse.json(user);
};
