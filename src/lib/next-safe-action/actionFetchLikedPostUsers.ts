"use server";

import { z } from "zod";
import { fetchPostLikes } from "../drizzle/queries/posts/fetchPostLikes";
import { authActionClient } from "../safeAction";

export const actionFetchLikedPostUsers = authActionClient
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
