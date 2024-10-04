"use server";

import { z } from "zod";
import { optionalAuthClient } from "./init";
import { fetchPostLikes } from "../drizzle/queries/fetchPostLikes";

export const actionFetchLikedPostUsers = optionalAuthClient
  .schema(
    z.object({
      postId: z.string(),
      page: z.number().optional(),
    }),
  )
  .action(async ({ parsedInput: { postId, page }, ctx: { userId } }) => {
    try {
      const result = await fetchPostLikes({ postId, authUserId: userId, page });
      return result;
    } catch (err) {
      throw err;
    }
  });
