import { ilike, or } from "drizzle-orm";
import { db } from "../../db";
import { UsersTable } from "../../schema";

const query = async (searchKey: string) => {
  return db
    .select({
      id: UsersTable.id,
      username: UsersTable.username,
      name: UsersTable.name,
      avatar: UsersTable.avatar,
    })
    .from(UsersTable)
    .where(
      or(
        ilike(UsersTable.username, `%${searchKey}%`),
        ilike(UsersTable.name, `%${searchKey}%`),
      ),
    );
};

export type TSearch = Awaited<ReturnType<typeof query>>[number];

export const searchUser = async (searchKey: string) => {
  const users = await query(searchKey);
  return users;
};
