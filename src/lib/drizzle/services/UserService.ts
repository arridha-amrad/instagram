import { and, eq } from "drizzle-orm";
import { SearchUsersTable, UsersTable } from "../schema";
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
    const result = await this.db.insert(UsersTable).values(data).returning();
    return result;
  }

  public async updateUser(id: string, data: UpdateProps) {
    const result = await this.db
      .update(UsersTable)
      .set(data)
      .where(eq(UsersTable.id, id))
      .returning();

    return result;
  }

  public async addUserToSearchHistory(
    params: typeof SearchUsersTable.$inferInsert,
  ) {
    const result = await this.db
      .insert(SearchUsersTable)
      .values(params)
      .returning()
      .onConflictDoNothing();
    return result;
  }

  public async removeUserFromSearchHistory(
    params: typeof SearchUsersTable.$inferSelect,
  ) {
    const result = await this.db
      .delete(SearchUsersTable)
      .where(
        and(
          eq(SearchUsersTable.userId, params.userId),
          eq(SearchUsersTable.searchId, params.searchId),
        ),
      )
      .returning();
    return result;
  }

  public async removeAllUserFromSearchHistory(userId: string) {
    const result = await this.db
      .delete(SearchUsersTable)
      .where(eq(SearchUsersTable.userId, userId))
      .returning();
    return result;
  }
}

export default UserService;
