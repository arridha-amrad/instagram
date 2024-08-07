"use server";

import { z } from "zod";
import { follow } from "../drizzle/mutations/follow";
import { authActionClient } from "./init";

const schema = z.object({
  followId: z.string(),
  pathname: z.string().nullable(),
});

export const actionFollowUser = authActionClient
  .schema(schema)
  .action(async ({ parsedInput: { followId }, ctx: { userId: authId } }) => {
    try {
      const result = await follow({ authUserId: authId, followId });
      return result;
    } catch (err) {
      throw err;
    }
  });
