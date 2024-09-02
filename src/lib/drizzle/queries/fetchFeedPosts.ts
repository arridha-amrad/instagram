import db from "@/lib/drizzle/db";
import { TFeedPost, TInfiniteResult } from "@/lib/drizzle/queries/type";
import {
  CommentsTable,
  PostLikesTable,
  PostsTable,
  RepliesTable,
  UsersTable,
} from "@/lib/drizzle/schema";
import { desc, eq, lte, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

const LIMIT = 5;

type Args = {
  userId?: string;
  page: number;
  date?: Date;
  total?: number;
};

const fetchPosts = async ({
  page,
  userId,
  date = new Date(),
  total = 0,
}: Args): Promise<TInfiniteResult<TFeedPost>> => {
  //
  if (total === 0) {
    const [result] = await db
      .select({
        sum: sql<number>`CAST(COUNT(${PostsTable.id}) as int)`,
      })
      .from(PostsTable)
      .where(lte(PostsTable.createdAt, date));
    total = result.sum;
  }

  const data = await db
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
      sumLikes: sql<number>`CAST(COUNT(DISTINCT ${PostLikesTable}) as int)`,
      sumComments: sql<number>`
        CAST(COUNT(DISTINCT ${CommentsTable.id}) as int) +
        CAST(COUNT(DISTINCT ${RepliesTable.id}) as int)
        `,
    })
    .from(PostsTable)
    .where(lte(PostsTable.createdAt, date))
    .limit(LIMIT)
    .orderBy(desc(PostsTable.createdAt))
    .leftJoin(PostLikesTable, eq(PostsTable.id, PostLikesTable.postId))
    .leftJoin(CommentsTable, eq(PostsTable.id, CommentsTable.postId))
    .leftJoin(RepliesTable, eq(CommentsTable.id, RepliesTable.commentId))
    .innerJoin(UsersTable, eq(PostsTable.userId, UsersTable.id))
    .groupBy(PostsTable.id, UsersTable.id);

  return {
    data: data.map((v) => ({ ...v, comments: [] })),
    date,
    total,
    page,
  };
};

export const fetchFeedPosts = unstable_cache(fetchPosts, ["fetchFeedPosts"], {
  tags: ["fetchFeedPosts"],
});
