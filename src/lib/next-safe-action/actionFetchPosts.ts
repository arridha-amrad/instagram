"use server";

import fetchPosts from "@/lib/drizzle/queries/fetchPosts";
import { authActionClient } from "@/lib/next-safe-action/init";
import { z } from "zod";

export const actionFetchPosts = authActionClient
  .schema(
    z.object({
      page: z.number(),
    }),
  )
  .action(async ({ ctx: { userId }, parsedInput: { page } }) => {
    const result = await fetchPosts({
      page,
      userId,
    });
    return result;
  });
