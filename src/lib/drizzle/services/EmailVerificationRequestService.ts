import { eq } from "drizzle-orm";
import { EmailVerificationRequestTable } from "../schema";
import BaseService from "./BaseService";

class EmailVerificationRequestService extends BaseService {
  public async create(args: typeof EmailVerificationRequestTable.$inferInsert) {
    await this.removeByUserId(args.userId);
    const result = await this.db
      .insert(EmailVerificationRequestTable)
      .values(args)
      .returning();
    return result;
  }

  public async removeByUserId(userId: string) {
    const result = await this.db
      .delete(EmailVerificationRequestTable)
      .where(eq(EmailVerificationRequestTable.userId, userId))
      .returning();
    return result;
  }

  public async findByUserId(userId: string) {
    const result = await this.db
      .select()
      .from(EmailVerificationRequestTable)
      .where(eq(EmailVerificationRequestTable.userId, userId));
    return result;
  }

  public async findById(id: string) {
    const result = await this.db
      .select()
      .from(EmailVerificationRequestTable)
      .where(eq(EmailVerificationRequestTable.id, id));
    return result;
  }
}

export default EmailVerificationRequestService;
