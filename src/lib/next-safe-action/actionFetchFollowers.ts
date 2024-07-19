"use server";

import { z } from "zod";
import { safeActionClient } from "./init";
import { fetchUserFollowers } from "../drizzle/queries/fetchUserFollowers";

export const actionFetchFollowers = safeActionClient
  .schema(
    z.object({
      userId: z.string(),
      authUserId: z.string().optional(),
    }),
  )
  .action(async ({ parsedInput: { userId, authUserId } }) => {
    try {
      const result = await fetchUserFollowers({ userId, authUserId });
      return result;
    } catch (err) {
      throw err;
    }
  });
