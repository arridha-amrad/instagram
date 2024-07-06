import db from "@/lib/drizzle/db";
import {
  CommentsTable,
  FollowingsTable,
  PostLikesTable,
  PostsTable,
  UsersTable,
} from "@/lib/drizzle/schema";
import { and, eq, exists, inArray, notExists, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const posts = await db

      .select({
        id: PostsTable.id,
        // likes: sql<number>`cast(count(${PostLikesTable.postId}) as int)`,
        comments: sql<number>`cast(count(${CommentsTable.id}) as int)`,
      })
      .from(PostsTable)
      .limit(5)
      // .leftJoin(PostLikesTable, eq(PostLikesTable.postId, PostsTable.id))
      .leftJoin(CommentsTable, eq(CommentsTable.postId, PostsTable.id));
    // .groupBy(PostsTable.id);
    return NextResponse.json(posts, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 },
    );
  }
};

// tampilkan users yang tidak di follow oleh rasmus

// 954b9d75-23e3-437d-a128-b4e01ff0e556 -> bruno
// 4f70c468-ea07-4396-a6c0-609948f48e69 -> rasmus;

// export const GET = async (request: NextRequest) => {
//   const userId = "4f70c468-ea07-4396-a6c0-609948f48e69";

//   // total users ada 8 orang
//   const allUsers = await db.query.UsersTable.findMany({
//     columns: {
//       username: true,
//     },
//   });

//   // saat ini rasmus mengikuti 5 orang
//   const followingsUser = await db.query.FollowingsTable.findMany({
//     columns: {},
//     with: {
//       follow: {
//         columns: {
//           username: true,
//         },
//       },
//     },
//     where(fields, { and, eq }) {
//       return and(eq(fields.userId, userId));
//     },
//   });

//   const username = followingsUser.map((v) => v.follow.username);

//   // rasmus tidak mengikuti 3 orang termasuk ia sendiri
//   const notFollowingsUser = await db.query.UsersTable.findMany({
//     columns: {
//       id: true,
//       name: true,
//     },
//     where(fields, { and, ne, notInArray }) {
//       return and(notInArray(fields.username, username), ne(fields.id, userId));
//     },
//   });

//   return NextResponse.json({ allUsers, followingsUser, notFollowingsUser });
// };
