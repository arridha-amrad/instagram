import { eq } from "drizzle-orm";
import { db } from "../db";
import { UsersTable } from "../schema";
import BaseService from "./BaseService";

type UpdateProps = Partial<
  Omit<typeof UsersTable.$inferSelect, "id" | "provider">
>;

class UserService extends BaseService {
  public async findUserByEmail(email: string) {
    const user = await this.db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.email, email));
    return user;
  }

  public async findUserByUsername(username: string) {
    const user = await this.db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.username, username));
    return user;
  }

  public async findUserById(id: string) {
    const user = await this.db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.id, id));
    return user;
  }

  public async createUser(data: typeof UsersTable.$inferInsert) {
    const result = await db.insert(UsersTable).values(data).returning();
    return result;
  }

  public async updateUser(id: string, data: UpdateProps) {
    const result = await db
      .update(UsersTable)
      .set(data)
      .where(eq(UsersTable.id, id))
      .returning();

    return result;
  }
}

export default UserService;
