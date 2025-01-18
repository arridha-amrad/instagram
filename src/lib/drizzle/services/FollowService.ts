import { and, eq } from "drizzle-orm";
import { FollowingsTable } from "../schema";
import BaseService from "./BaseService";

type Args = {
  userId: string;
  followId: string;
};

export default class FollowService extends BaseService {
  public async create(data: typeof FollowingsTable.$inferInsert) {
    const result = await this.db
      .insert(FollowingsTable)
      .values(data)
      .returning();
    return result;
  }

  public async find({ userId, followId }: Args) {
    const result = await this.db
      .select()
      .from(FollowingsTable)
      .where(
        and(
          eq(FollowingsTable.userId, userId),
          eq(FollowingsTable.followId, followId),
        ),
      );
    return result;
  }

  public async delete({ followId, userId }: Args) {
    await this.db
      .delete(FollowingsTable)
      .where(
        and(
          eq(FollowingsTable.userId, userId),
          eq(FollowingsTable.followId, followId),
        ),
      );
  }
}
