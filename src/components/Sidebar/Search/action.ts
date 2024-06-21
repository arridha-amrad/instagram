"use server";

import db from "@/lib/drizzle/db";
import { SearchUsersTable } from "@/lib/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export const searchUser = async (prevState: any, formData: FormData) => {
  const search = formData.get("search") as string;

  const result = await db.query.UsersTable.findMany({
    columns: {
      avatar: true,
      id: true,
      name: true,
      username: true,
    },
    limit: 10,
    where(fields, { or, ilike }) {
      return or(
        ilike(fields.username, `%${search}%`),
        ilike(fields.name, `%${search}%`),
      );
    },
  });

  return {
    data: result,
    isSearched: true,
  };
};

type Args = {
  searchId: string;
  userId: string;
};
export const saveSearchUser = async ({ searchId, userId }: Args) => {
  if (!searchId || !userId) return;
  await db
    .insert(SearchUsersTable)
    .values({
      searchId,
      userId,
    })
    .onConflictDoNothing();

  revalidateTag("fetchSearchHistories");
};

export const removeFromHistories = async ({ searchId, userId }: Args) => {
  if (!searchId || !userId) return;
  await db
    .delete(SearchUsersTable)
    .where(
      and(
        eq(SearchUsersTable.userId, userId),
        eq(SearchUsersTable.searchId, searchId),
      ),
    );
  revalidateTag("fetchSearchHistories");
};

export const removeAllFromHistories = async ({
  userId,
}: {
  userId: string;
}) => {
  if (userId === "") return;
  await db.delete(SearchUsersTable).where(eq(SearchUsersTable.userId, userId));
  revalidateTag("fetchSearchHistories");
};
