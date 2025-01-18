import { eq } from "drizzle-orm";
import { db } from "../../db";
import { UsersTable, PostsTable } from "../../schema";

export const fetchPostMetadata = async (postId: string) => {
  const [post] = await db
    .select({
      username: UsersTable.username,
      createdAt: PostsTable.createdAt,
    })
    .from(PostsTable)
    .where(eq(PostsTable.id, postId))
    .innerJoin(UsersTable, eq(UsersTable.id, PostsTable.userId));

  return post;
};
