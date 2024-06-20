"use server";

import db from "@/lib/drizzle/db";
import { FollowingsTable } from "@/lib/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

type Args = {
  authId: string;
  userId: string;
};

export default async function follow({ authId, userId: uId }: Args) {
  const isFollowed = await db.query.FollowingsTable.findFirst({
    where({ followId, userId }, { and, eq }) {
      return and(eq(followId, uId), eq(userId, authId));
    },
  });
  if (!isFollowed) {
    await db.insert(FollowingsTable).values({ followId: uId, userId: authId });
  } else {
    await db
      .delete(FollowingsTable)
      .where(
        and(
          eq(FollowingsTable.followId, uId),
          eq(FollowingsTable.userId, authId),
        ),
      );
  }
  revalidateTag("fetch-user");
}
