import db from "@/lib/drizzle/db";
import { PostLikesTable, PostsTable, UsersTable } from "@/lib/drizzle/schema";
import { count, desc, eq, sql } from "drizzle-orm";
import { OWNER, POST } from "./constants";

export const fetchPosts = async (userId?: string) => {
  const posts = db
    .select({
      // owner: OWNER,
      ...POST,
      sumLikes: sql<number>`${count(PostLikesTable.postId)}`.as("sum_likes"),
    })
    .from(PostsTable)
    .limit(10)
    .orderBy(desc(PostsTable.createdAt))
    // .innerJoin(UsersTable, eq(UsersTable.id, PostsTable.userId))
    .leftJoin(PostLikesTable, eq(PostLikesTable.postId, PostsTable.id))
    .groupBy(PostLikesTable.postId, PostsTable.id);
  return posts;
};

// export const preparePosts = db.select().from(PostsTable).prepare("select_posts")

// export const sq = db
//   .$with("sq")
//   .as(
//     db
//       .select()
//       .from(PostsTable)
//       .where(eq(PostsTable.id, "56411c05-91ef-4e4b-be04-776c4a131c35"))
//   );

export const sqPosts = db
  .select({ ...POST })
  .from(PostsTable)
  .as("sqPosts");

export const fetchPosts2 = async () => {
  const posts = await db
    .select({
      id: sqPosts.id,
      userId: sqPosts.userId,
      description: sqPosts.description,
      location: sqPosts.location,
      urls: sqPosts.urls,
      createdAt: sqPosts.createdAt,
      updatedAt: sqPosts.updatedAt,
      owner: {
        ...OWNER,
      },
    })
    .from(sqPosts)
    .innerJoin(UsersTable, eq(UsersTable.id, sqPosts.userId));
  console.log(JSON.stringify(posts, null, 2));
};
