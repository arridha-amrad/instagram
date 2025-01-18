"use server";

import { z } from "zod";
import { follow } from "../actions/follow";
import { authClient } from "./init";
import { revalidateTag } from "next/cache";

const schema = z.object({
  followId: z.string(),
  pathname: z.string().nullable(),
});

export const actionFollowUser = authClient
  .schema(schema)
  .action(async ({ parsedInput: { followId }, ctx: { userId: authId } }) => {
    try {
      const result = await follow({ authUserId: authId, followId });
      revalidateTag("fetchUserProfile");
      return result;
    } catch (err) {
      throw err;
    }
  });
