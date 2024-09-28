import db from "@/lib/drizzle/db";
import { aliasedTable, eq, sql } from "drizzle-orm";
import { FollowingsTable, UsersTable } from "@/lib/drizzle/schema";

type Args = {
  username: string;
  authUserId?: string;
};

const query = async (username: string, authUserId?: string) => {
  const users = aliasedTable(UsersTable, "u");
  return db
    .select({
      id: users.id,
      username: users.username,
      name: users.name,
      avatar: users.avatar,
      isFollow: sql<boolean>`
        CASE WHEN EXISTS (
          SELECT 1 
          FROM ${FollowingsTable}
          WHERE ${FollowingsTable.userId} = ${authUserId}
          AND ${FollowingsTable.followId} = ${users.id}
        )
          THEN true
          ELSE false
        END
      `,
    })
    .from(UsersTable)
    .where(eq(UsersTable.username, username))
    .leftJoin(FollowingsTable, eq(FollowingsTable.followId, UsersTable.id))
    .innerJoin(users, eq(users.id, FollowingsTable.userId));
};

export type TFollow = Awaited<ReturnType<typeof query>>[number];

export const fetchUserFollowers = async ({
  authUserId,
  username,
}: Args): Promise<TFollow[]> => {
  const data = await query(username, authUserId);
  return data;
};
