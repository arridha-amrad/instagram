import { db } from "@/lib/drizzle/db";
import { unstable_cache } from "next/cache";
import { UserInfoTable, UsersTable } from "../../schema";
import { eq } from "drizzle-orm";

type Params = {
  username: string;
};

const query = async (username: string) => {
  const result = await db
    .select({
      id: UsersTable.id,
      username: UsersTable.username,
      avatar: UsersTable.avatar,
      bio: UserInfoTable.bio,
      gender: UserInfoTable.gender,
      occupation: UserInfoTable.occupation,
      website: UserInfoTable.website,
    })
    .from(UsersTable)
    .where(eq(UsersTable.username, username))
    .leftJoin(UserInfoTable, eq(UserInfoTable.userId, UsersTable.id));
  return result.length > 0 ? result[0] : null;
};

export type TProfileDetail = Awaited<ReturnType<typeof query>>;

const fetchUser = async ({ username }: Params): Promise<TProfileDetail> => {
  const user = await query(username);
  return user;
};

export const fetchUserProfileDetails = unstable_cache(
  fetchUser,
  ["fetchUserProfileDetails"],
  {
    tags: ["fetchUserProfileDetails"],
  },
);
