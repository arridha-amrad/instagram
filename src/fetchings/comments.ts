import db from "@/lib/drizzle/db";
import { CommentsTable, UsersTable } from "@/lib/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { COMMENT, OWNER } from "./constants";

export async function fetchComments({ postId }: { postId: string }) {
  const [comments] = await db
    .select({
      ...COMMENT,
      owner: OWNER,
    })
    .from(CommentsTable)
    .limit(10)
    .orderBy(desc(CommentsTable.createdAt))
    .where(eq(CommentsTable.postId, postId))
    .innerJoin(UsersTable, eq(UsersTable.id, CommentsTable.userId));

  return comments;
}
