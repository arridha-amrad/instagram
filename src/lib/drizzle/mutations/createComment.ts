import db from "../db";
import { CommentsTable } from "../schema";

export const createComment = async (
  args: typeof CommentsTable.$inferInsert,
) => {
  const [response] = await db.insert(CommentsTable).values(args).returning();
  return response;
};
