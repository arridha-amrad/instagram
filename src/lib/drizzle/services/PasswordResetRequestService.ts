import { and, eq } from "drizzle-orm";
import { PasswordResetRequestTable } from "../schema";
import BaseService from "./BaseService";

export default class PasswordResetRequestService extends BaseService {
  public async create(args: typeof PasswordResetRequestTable.$inferInsert) {
    await this.removeByUserId(args.userId);
    const result = await this.db
      .insert(PasswordResetRequestTable)
      .values(args)
      .returning();
    return result;
  }

  public async removeByUserId(userId: string) {
    const result = await this.db
      .delete(PasswordResetRequestTable)
      .where(eq(PasswordResetRequestTable.userId, userId))
      .returning();
    return result;
  }

  public async findByUserIdAndCode(userId: string, code: string) {
    const result = await this.db
      .select()
      .from(PasswordResetRequestTable)
      .where(
        and(
          eq(PasswordResetRequestTable.userId, userId),
          eq(PasswordResetRequestTable.code, code),
        ),
      );
    return result;
  }
}
