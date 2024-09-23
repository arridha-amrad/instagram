import db from "@/lib/drizzle/db";
import {
  FollowingsTable,
  PostLikesTable,
  PostsTable,
  SearchUsersTable,
  UserInfoTable,
  UsersTable,
} from "@/lib/drizzle/schema";
import { aliasedTable, desc, eq, lte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import crypto from "crypto";

// const query = db
//   .select()
//   .from(PostsTable)
//   .where(lte(PostsTable.createdAt, sql.placeholder("date")))
//   .orderBy(desc(PostsTable.createdAt))
//   .limit(5)
//   .prepare("query_feed_posts");

// const query = async (userId: string) => {
//   return db
//     .select({
//       id: UsersTable.id,
//       username: UsersTable.username,
//       avatar: UsersTable.avatar,
//       name: UsersTable.name,
//     })
//     .from(SearchUsersTable)
//     .where(eq(SearchUsersTable.userId, userId))
//     .innerJoin(UsersTable, eq(UsersTable.id, SearchUsersTable.searchId));
// };

export const GET = async (req: Request) => {
  // const date = new Date("2024-06-29T06:31:21.144Z");
  // const userId = "4f70c468-ea07-4396-a6c0-609948f48e69";
  // let uuid = crypto.randomUUID();
  // const users = await query(userId, uuid);
  // return NextResponse.json(users);
};
