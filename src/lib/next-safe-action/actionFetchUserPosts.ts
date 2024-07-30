"use server";

import { getUserPosts } from "@/lib/drizzle/queries/fetchUserPosts";
import { authActionClient } from "@/lib/next-safe-action/init";
import { z } from "zod";

export const actionFetchUserPosts = authActionClient
  .schema(
    z.object({
      page: z.number(),
      username: z.string(),
    }),
  )
  .action(async ({ parsedInput: { page, username } }) => {
    const result = await getUserPosts({
      page,
      username,
    });
    return result;
  });
