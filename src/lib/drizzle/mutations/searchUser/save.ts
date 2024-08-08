import db from "../../db";
import { SearchUsersTable } from "../../schema";

type Params = {
  searchId: string;
  authUserId: string;
};

export const save = async ({ authUserId, searchId }: Params) => {
  await db
    .insert(SearchUsersTable)
    .values({
      searchId,
      userId: authUserId,
    })
    .onConflictDoNothing();
};
