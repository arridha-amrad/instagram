import { db } from "@/lib/drizzle/db";
import { aliasedTable, eq, sql } from "drizzle-orm";
import { FollowingsTable, UsersTable } from "../../schema";

type Args = {
  username: string;
  authUserId?: string;
};

const query = async (username: string, authUserId?: string) => {
  const u = aliasedTable(UsersTable, "u");
  return db
    .select({
      id: UsersTable.id,
      username: UsersTable.username,
      avatar: UsersTable.avatar,
      name: UsersTable.name,
      isFollow: sql<boolean>`
        CASE WHEN EXISTS (
          SELECT 1
          FROM ${FollowingsTable}
          WHERE ${FollowingsTable.userId} = ${authUserId}
          AND ${FollowingsTable.followId} = ${UsersTable.id}
        )
          THEN true
          ELSE false
        END
      `,
    })
    .from(u)
    .leftJoin(FollowingsTable, eq(FollowingsTable.userId, u.id))
    .innerJoin(UsersTable, eq(FollowingsTable.followId, UsersTable.id))
    .where(eq(u.username, username));
};

export type TFollowing = Awaited<ReturnType<typeof query>>[number];

export const fetchUserFollowings = async ({
  username,
  authUserId,
}: Args): Promise<TFollowing[]> => {
  const data = await query(username, authUserId);
  return data;
};
