import { unstable_cache } from "next/cache";
import { db } from "../../db";
import { UsersTable } from "../../schema";
import { eq } from "drizzle-orm";
import { USERS } from "@/lib/cacheKeys";

const fetchUserMetadata = unstable_cache(
  async (username: string) => {
    const [user] = await db
      .select({
        username: UsersTable.username,
        name: UsersTable.name,
      })
      .from(UsersTable)
      .where(eq(UsersTable.username, username));
    return user;
  },
  [USERS.metadata],
  {
    tags: [USERS.metadata],
  },
);

export default fetchUserMetadata;
