import { and, eq } from "drizzle-orm";
import db from "../../db";
import { SearchUsersTable } from "../../schema";

type Params = {
  authUserId: string;
  searchId: string;
};

export const remove = async ({ authUserId, searchId }: Params) => {
  await db
    .delete(SearchUsersTable)
    .where(
      and(
        eq(SearchUsersTable.userId, authUserId),
        eq(SearchUsersTable.searchId, searchId),
      ),
    );
};
