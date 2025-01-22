import { POST } from "@/lib/cacheKeys";
import { db } from "@/lib/drizzle/db";
import { TInfiniteResult } from "@/lib/drizzle/queries/type";
import {
  CommentsTable,
  PostLikesTable,
  PostsTable,
  RepliesTable,
  UsersTable,
} from "@/lib/drizzle/schema";
import { desc, eq, lt, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

const LIMIT = 5;

type TArgs = {
  userId: string;
  date: Date;
};
const runQuery = async ({ date, userId }: TArgs) => {
  return db
    .select({
      id: PostsTable.id,
      username: UsersTable.username,
      avatar: UsersTable.avatar,
      userId: PostsTable.userId,
      createdAt: PostsTable.createdAt,
      updatedAt: PostsTable.updatedAt,
      description: PostsTable.description,
      location: PostsTable.location,
      urls: PostsTable.urls,
      isLiked: sql<boolean>`
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM ${PostLikesTable}
            WHERE ${PostLikesTable.postId} = ${PostsTable.id}
            AND ${PostLikesTable.userId} = ${userId}
          ) THEN true
          ELSE false
        END
      `,
      sumLikes: sql<number>`
        CAST(COUNT(DISTINCT ${PostLikesTable}) as int)
      `,
      sumComments: sql<number>`
        CAST(COUNT(DISTINCT ${CommentsTable.id}) as int) +
        CAST(COUNT(DISTINCT ${RepliesTable.id}) as int)
      `,
    })
    .from(PostsTable)
    .where(lt(PostsTable.createdAt, date))
    .leftJoin(PostLikesTable, eq(PostsTable.id, PostLikesTable.postId))
    .leftJoin(CommentsTable, eq(PostsTable.id, CommentsTable.postId))
    .leftJoin(RepliesTable, eq(CommentsTable.id, RepliesTable.commentId))
    .innerJoin(UsersTable, eq(PostsTable.userId, UsersTable.id))
    .groupBy(PostsTable.id, UsersTable.id)
    .orderBy(desc(PostsTable.createdAt))
    .limit(LIMIT);
};

export type TFeedPost = Awaited<ReturnType<typeof runQuery>>[number];

type Args = {
  userId: string;
  page: number;
  date?: Date;
  total?: number;
};

export const fetchFeedPosts = unstable_cache(
  async ({
    page,
    userId,
    date = new Date(),
    total = 0,
  }: Args): Promise<TInfiniteResult<TFeedPost>> => {
    if (total === 0) {
      const [result] = await db
        .select({
          sum: sql<number>`CAST(COUNT(${PostsTable.id}) as int)`,
        })
        .from(PostsTable)
        .where(lt(PostsTable.createdAt, date));
      total = result.sum;
    }

    const posts = await runQuery({ date, userId });

    return {
      data: posts,
      date,
      total,
      page,
    };
  },
  [POST.homePosts],
  {
    tags: [POST.homePosts],
  },
);
