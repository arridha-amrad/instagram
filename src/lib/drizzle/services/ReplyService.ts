import { RepliesTable } from "../schema";
import BaseService from "./BaseService";

export default class ReplyService extends BaseService {
  public async create(data: typeof RepliesTable.$inferInsert) {
    const result = await this.db.insert(RepliesTable).values(data).returning();
    return result;
  }
}
