import { db } from "@/lib/drizzle/db";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { SearchUsersTable, UsersTable } from "../../schema";

const query = async (userId: string) => {
  return db
    .select({
      id: UsersTable.id,
      username: UsersTable.username,
      avatar: UsersTable.avatar,
      name: UsersTable.name,
    })
    .from(SearchUsersTable)
    .where(eq(SearchUsersTable.userId, userId))
    .innerJoin(UsersTable, eq(UsersTable.id, SearchUsersTable.searchId));
};

export type TSearchUser = Awaited<ReturnType<typeof query>>[number];

export const fetchHistories = async ({
  userId,
}: {
  userId: string;
}): Promise<TSearchUser[]> => {
  const users = await query(userId);
  return users;
};

export const fetchSearchHistories = unstable_cache(
  fetchHistories,
  ["fetchSearchHistories"],
  {
    tags: ["fetchSearchHistories"],
  },
);
