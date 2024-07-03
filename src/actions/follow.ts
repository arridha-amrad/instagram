"use server";

import db from "@/lib/drizzle/db";
import { FollowingsTable } from "@/lib/drizzle/schema";
import { actionClient } from "@/lib/safe-action";
import { and, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  authId: z.string(),
  userId: z.string(),
  pathname: z.string().nullable(),
});

export const followAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { authId, pathname, userId } }) => {
    if (authId === "") {
      redirect(`/login?cbUrl=${pathname}`);
    }
    const isFollow = await db.query.FollowingsTable.findFirst({
      where(fields, { and, eq }) {
        return and(eq(fields.followId, userId), eq(fields.userId, authId));
      },
    });
    if (!isFollow) {
      await db
        .insert(FollowingsTable)
        .values({ followId: userId, userId: authId });
    } else {
      await db
        .delete(FollowingsTable)
        .where(
          and(
            eq(FollowingsTable.followId, userId),
            eq(FollowingsTable.userId, authId),
          ),
        );
    }
    revalidateTag("fetch-user");
  });
