import db from "@/lib/drizzle/db";
import { unstable_cache } from "next/cache";

export const fetchSearchHistories = unstable_cache(
  async ({ userId }: { userId: string }) => getSearchHistories({ userId }),
  ["histories"],
  {
    tags: ["fetchSearchHistories"],
  },
);

export const getSearchHistories = async ({ userId }: { userId: string }) => {
  const result = await db.query.SearchUsersTable.findMany({
    columns: {
      searchId: false,
      userId: false,
    },
    with: {
      searchUser: {
        columns: {
          id: true,
          avatar: true,
          name: true,
          username: true,
        },
      },
    },
    where({ userId: uid }, { eq }) {
      return eq(uid, userId);
    },
  });

  return result;
};
