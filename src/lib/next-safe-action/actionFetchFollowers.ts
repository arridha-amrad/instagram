"use server";

import { z } from "zod";
import { optionalAuthClient } from "./init";
import { fetchUserFollowers } from "@/lib/drizzle/queries/users/fetchUserFollowers";

export const actionFetchFollowers = optionalAuthClient
  .schema(
    z.object({
      username: z.string(),
    }),
  )
  .action(async ({ parsedInput: { username }, ctx: { userId } }) => {
    try {
      const result = await fetchUserFollowers({ username, authUserId: userId });
      return result;
    } catch (err) {
      throw err;
    }
  });
