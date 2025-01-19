import { and, eq } from "drizzle-orm";
import { PostLikesTable, PostsTable } from "../schema";
import BaseService from "./BaseService";

export default class PostService extends BaseService {
  public async create(data: typeof PostsTable.$inferInsert) {
    const result = await this.db.insert(PostsTable).values(data).returning();
    return result;
  }

  public async findLike(params: typeof PostLikesTable.$inferSelect) {
    const result = await this.db
      .select()
      .from(PostLikesTable)
      .where(
        and(
          eq(PostLikesTable.postId, params.postId),
          eq(PostLikesTable.userId, params.userId),
        ),
      );
    return result;
  }

  public async dislike(params: typeof PostLikesTable.$inferSelect) {
    const result = await this.db
      .delete(PostLikesTable)
      .where(
        and(
          eq(PostLikesTable.postId, params.postId),
          eq(PostLikesTable.userId, params.userId),
        ),
      )
      .returning();
    return result;
  }

  public async like(params: typeof PostLikesTable.$inferSelect) {
    const result = await this.db
      .insert(PostLikesTable)
      .values({
        postId: params.postId,
        userId: params.userId,
      })
      .returning();
    return result;
  }
}
