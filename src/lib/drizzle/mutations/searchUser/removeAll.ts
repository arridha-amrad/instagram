import { eq } from "drizzle-orm";
import db from "../../db";
import { SearchUsersTable } from "../../schema";

export const removeAll = async (authUserId: string) => {
  await db
    .delete(SearchUsersTable)
    .where(eq(SearchUsersTable.userId, authUserId));
};
