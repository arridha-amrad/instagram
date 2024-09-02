import db from "@/lib/drizzle/db";
import {
  CommentsTable,
  PostLikesTable,
  PostsTable,
  RepliesTable,
  UsersTable,
} from "@/lib/drizzle/schema";
import { desc, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const userId = "1d22478a-6a91-4269-bc3a-d064f5f557e6";
  const result = await db
    .select({
      owner: {
        id: UsersTable.id,
        username: UsersTable.username,
        avatar: UsersTable.avatar,
      },
      id: PostsTable.id,
      createdAt: PostsTable.createdAt,
      updatedAt: PostsTable.updatedAt,
      userId: PostsTable.userId,
      description: PostsTable.description,
      location: PostsTable.location,
      urls: PostsTable.urls,
      isLiked: sql<boolean>`
        CASE 
          WHEN EXISTS (
            SELECT * FROM likes l
            WHERE l.post_id = ${PostsTable.id}
            AND l.user_id = ${userId}
          ) THEN true
          ELSE false
        END
      `,
      totalLikes: sql<number>`CAST(COUNT(DISTINCT ${PostLikesTable}) as int)`,
      totalComments: sql<number>`
        CAST(COUNT(DISTINCT ${CommentsTable.id}) as int) +
        CAST(COUNT(DISTINCT ${RepliesTable.id}) as int)
        `,
    })
    .from(PostsTable)
    .limit(2)
    .orderBy(desc(PostsTable.createdAt))
    .leftJoin(PostLikesTable, eq(PostsTable.id, PostLikesTable.postId))
    .leftJoin(CommentsTable, eq(PostsTable.id, CommentsTable.postId))
    .leftJoin(RepliesTable, eq(CommentsTable.id, RepliesTable.commentId))
    .innerJoin(UsersTable, eq(PostsTable.userId, UsersTable.id))
    .groupBy(PostsTable.id, UsersTable.id);

  return NextResponse.json(result, { status: 200 });
};
