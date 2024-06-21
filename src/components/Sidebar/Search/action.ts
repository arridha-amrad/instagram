"use server";

import db from "@/lib/drizzle/db";
import { SearchUsersTable } from "@/lib/drizzle/schema";
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
  };
};

type Args = {
  searchId: string;
  userId: string;
};
export const saveSearchUser = async ({ searchId, userId }: Args) => {
  await db.insert(SearchUsersTable).values({
    searchId,
    userId,
  });

  revalidateTag("fetch-search-history");
};
