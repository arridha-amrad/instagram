import { PostsTable } from "../schema";
import BaseService from "./BaseService";

export default class PostService extends BaseService {
  public async create(data: typeof PostsTable.$inferInsert) {
    const result = await this.db.insert(PostsTable).values(data).returning();
    return result;
  }
}
