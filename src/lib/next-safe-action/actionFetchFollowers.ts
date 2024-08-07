"use server";

import { z } from "zod";
import { optionalAuthActionClient } from "./init";
import { fetchUserFollowers } from "@/lib/drizzle/queries/fetchUserFollowers";

export const actionFetchFollowers = optionalAuthActionClient
  .schema(
    z.object({
      username: z.string(),
      authUserId: z.string().optional(),
    }),
  )
  .action(async ({ parsedInput: { username, authUserId } }) => {
    try {
      const result = await fetchUserFollowers({ username, authUserId });
      return result;
    } catch (err) {
      throw err;
    }
  });
