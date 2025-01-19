import { and, eq } from "drizzle-orm";
import { RepliesTable, ReplyLikesTable } from "../schema";
import BaseService from "./BaseService";

export default class ReplyService extends BaseService {
  public async create(data: typeof RepliesTable.$inferInsert) {
    const result = await this.db.insert(RepliesTable).values(data).returning();
    return result;
  }

  public async findLike(params: typeof ReplyLikesTable.$inferSelect) {
    const result = await this.db
      .select()
      .from(ReplyLikesTable)
      .where(
        and(
          eq(ReplyLikesTable.replyId, params.replyId),
          eq(ReplyLikesTable.userId, params.userId),
        ),
      );
    return result;
  }

  public async like(params: typeof ReplyLikesTable.$inferInsert) {
    const result = await this.db
      .insert(ReplyLikesTable)
      .values(params)
      .returning();
    return result;
  }

  public async dislike(params: typeof ReplyLikesTable.$inferSelect) {
    const result = await this.db
      .delete(ReplyLikesTable)
      .where(
        and(
          eq(ReplyLikesTable.replyId, params.replyId),
          eq(ReplyLikesTable.userId, params.userId),
        ),
      )
      .returning();
    return result;
  }
}
