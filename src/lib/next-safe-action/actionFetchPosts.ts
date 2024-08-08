"use server";

import { fetchFeedPosts } from "@/lib/drizzle/queries/fetchFeedPosts";
import { authActionClient } from "@/lib/next-safe-action/init";
import { z } from "zod";

export const actionFetchPosts = authActionClient
  .schema(
    z.object({
      page: z.number(),
      date: z.date(),
    }),
  )
  .action(async ({ ctx: { userId }, parsedInput: { page, date } }) => {
    const result = await fetchFeedPosts({
      page,
      userId,
      date,
    });
    return result;
  });
