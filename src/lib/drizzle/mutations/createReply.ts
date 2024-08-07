import db from "../db";
import { RepliesTable } from "../schema";

export const createReply = async (args: typeof RepliesTable.$inferInsert) => {
  const [response] = await db.insert(RepliesTable).values(args).returning();
  return response;
};
