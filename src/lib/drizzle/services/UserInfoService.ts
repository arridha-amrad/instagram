import { eq } from "drizzle-orm";
import { UserInfoTable } from "../schema";
import BaseService from "./BaseService";

type InsertProps = typeof UserInfoTable.$inferInsert;
type UpdateProps = Partial<Omit<InsertProps, "userId" | "id">>;

class UserInfoService extends BaseService {
  public async create(data: InsertProps) {
    const result = await this.db.insert(UserInfoTable).values(data).returning();
    return result;
  }

  public async update(id: number, data: UpdateProps) {
    const result = await this.db
      .update(UserInfoTable)
      .set(data)
      .where(eq(UserInfoTable.id, id))
      .returning();
    return result;
  }

  public async findByUserId(userId: string) {
    const result = await this.db
      .select()
      .from(UserInfoTable)
      .where(eq(UserInfoTable.userId, userId));

    return result;
  }
}

export default UserInfoService;
