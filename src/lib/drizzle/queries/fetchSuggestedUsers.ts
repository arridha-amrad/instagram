import db from "@/lib/drizzle/db";
import { TSearchUser } from "./type";
import { FollowingsTable, UsersTable } from "../schema";
import { sql } from "drizzle-orm";

const query2 = async (userId: string) => {
  const result = await db.execute(sql`
    SELECT 
      ${UsersTable.id},
      ${UsersTable.username}, 
      ${UsersTable.avatar}, 
      ${UsersTable.name}
    FROM ${UsersTable}
    WHERE ${UsersTable.id} NOT IN (
      SELECT ${FollowingsTable.followId} 
      FROM ${FollowingsTable}
      WHERE ${FollowingsTable.userId} = ${userId}
    )
    AND ${UsersTable.id} != ${userId}
    `);

  return result.rows;
};

// const query = async (userId: string) => {
//   const followingIds = await db
//     .select({
//       followId: FollowingsTable.followId,
//     })
//     .from(FollowingsTable)
//     .where(eq(FollowingsTable.userId, userId));

//   const ids = followingIds.map((f) => f.followId);

//   const result = await db
//     .select({
//       id: UsersTable.id,
//       username: UsersTable.username,
//       avatar: UsersTable.avatar,
//       name: UsersTable.name,
//     })
//     .from(UsersTable)
//     .where(and(not(inArray(UsersTable.id, ids)), ne(UsersTable.id, userId)));

//   const r2 = await query2(userId);
//   console.log(r2);

//   return result;
// };

const fetchSuggestedUsers = async (
  authUserId: string,
): Promise<TSearchUser[]> => {
  const users = await query2(authUserId);
  return users as TSearchUser[];
};

export default fetchSuggestedUsers;
