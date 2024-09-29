import db from "@/lib/drizzle/db";
import {
  CommentsTable,
  PostLikesTable,
  PostsTable,
  RepliesTable,
  UsersTable,
} from "../schema";
import { eq, sql } from "drizzle-orm";

type Params = {
  postId: string;
  userId?: string;
};

const query = async (postId: string, userId?: string) => {
  return db
    .select({
      id: PostsTable.id,
      userId: PostsTable.userId,
      username: UsersTable.username,
      avatar: UsersTable.avatar,
      createdAt: PostsTable.createdAt,
      updatedAt: PostsTable.updatedAt,
      description: PostsTable.description,
      location: PostsTable.location,
      urls: PostsTable.urls,
      sumLikes: sql<number>`
        CAST(COUNT(DISTINCT ${PostLikesTable})AS Int)
      `,
      sumComments: sql<number>`
        CAST(COUNT(DISTINCT ${CommentsTable.id}) AS Int) +
        CAST(COUNT(DISTINCT ${RepliesTable.id}) AS Int)
      `,
      isLiked: sql<boolean>`
        CASE WHEN EXISTS (
            SELECT 1 FROM ${PostLikesTable}
            WHERE ${PostLikesTable.postId} = ${PostsTable.id}
            AND ${PostLikesTable.userId} = ${userId}
          ) 
            THEN true
            ELSE false
        END
      `,
    })
    .from(PostsTable)
    .where(eq(PostsTable.id, postId))
    .innerJoin(UsersTable, eq(UsersTable.id, PostsTable.userId))
    .leftJoin(PostLikesTable, eq(PostLikesTable.postId, PostsTable.id))
    .leftJoin(CommentsTable, eq(CommentsTable.postId, PostsTable.id))
    .leftJoin(RepliesTable, eq(RepliesTable.commentId, CommentsTable.id))
    .groupBy(PostsTable.id, UsersTable.id);
};

export type TPost = Awaited<ReturnType<typeof query>>[number];

export const fetchPost = async ({
  postId,
  userId,
}: Params): Promise<TPost | null> => {
  const post = await query(postId, userId);
  return post.length === 0 ? null : post[0];
};

// export const fetchPost = unstable_cache(getPost, ["fetch_posts"], {
//   tags: ["fetchPosts"],
// });
