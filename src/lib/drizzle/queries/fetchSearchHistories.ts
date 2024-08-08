import db from "@/lib/drizzle/db";
import { unstable_cache } from "next/cache";
import { TSearchUser } from "./type";

export const fetchHistories = async ({
  userId,
}: {
  userId: string;
}): Promise<TSearchUser[]> => {
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

  const users = result.reduce((prev, curr) => {
    prev.push(curr.searchUser);
    return prev;
  }, [] as TSearchUser[]);
  return users;
};

export const fetchSearchHistories = unstable_cache(
  fetchHistories,
  ["fetchSearchHistories"],
  {
    tags: ["fetchSearchHistories"],
  },
);
