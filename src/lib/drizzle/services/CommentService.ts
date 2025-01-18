import { and, eq } from "drizzle-orm";
import { CommentLikesTable, CommentsTable } from "../schema";
import BaseService from "./BaseService";

class CommentService extends BaseService {
  public async create(data: typeof CommentsTable.$inferInsert) {
    const result = await this.db.insert(CommentsTable).values(data).returning();
    return result;
  }

  public async like(data: typeof CommentLikesTable.$inferInsert) {
    await this.db.insert(CommentLikesTable).values(data);
  }

  public async disLike(data: typeof CommentLikesTable.$inferInsert) {
    await this.db
      .delete(CommentLikesTable)
      .where(
        and(
          eq(CommentLikesTable.userId, data.userId),
          eq(CommentLikesTable.commentId, data.commentId),
        ),
      );
  }

  public async findLike(data: typeof CommentLikesTable.$inferInsert) {
    const result = await this.db
      .select()
      .from(CommentLikesTable)
      .where(
        and(
          eq(CommentLikesTable.userId, data.userId),
          eq(CommentLikesTable.commentId, data.commentId),
        ),
      );
    return result;
  }
}

export default CommentService;
