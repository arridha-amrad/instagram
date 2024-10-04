"use server";

import { fetchUserPosts } from "@/lib/drizzle/queries/fetchUserPosts";
import { optionalAuthClient } from "@/lib/next-safe-action/init";
import { z } from "zod";

export const actionFetchUserPosts = optionalAuthClient
  .schema(
    z.object({
      username: z.string(),
      date: z.date(),
      total: z.number(),
    }),
  )
  .action(async ({ parsedInput: { username, date, total } }) => {
    const result = await fetchUserPosts({
      username,
      date,
      total,
    });
    return result;
  });
