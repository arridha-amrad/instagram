import { CommentsTable } from "../schema";
import BaseService from "./BaseService";

class CommentService extends BaseService {
  public async create(data: typeof CommentsTable.$inferInsert) {
    const result = await this.db.insert(CommentsTable).values(data).returning();
    return result;
  }
}

export default CommentService;
