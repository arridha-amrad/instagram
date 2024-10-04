"use server";

import { fetchFeedPosts } from "@/lib/drizzle/queries/fetchFeedPosts";
import { authClient } from "@/lib/next-safe-action/init";
import { z } from "zod";

export const actionFetchPosts = authClient
  .schema(
    z.object({
      page: z.number(),
      date: z.date(),
      total: z.number(),
    }),
  )
  .action(async ({ ctx: { userId }, parsedInput: { page, date, total } }) => {
    const result = await fetchFeedPosts({
      page,
      userId,
      date,
      total,
    });
    return result;
  });
