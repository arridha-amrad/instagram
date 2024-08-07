"use server";

import { z } from "zod";
import { optionalAuthActionClient } from "./init";
import { fetchPostLikes } from "../drizzle/queries/fetchPostLikes";

export const actionFetchLikedPostUsers = optionalAuthActionClient
  .schema(
    z.object({
      postId: z.string(),
      authUserId: z.string().optional(),
      page: z.number().optional(),
    }),
  )
  .action(async ({ parsedInput: { postId, authUserId, page } }) => {
    try {
      const result = await fetchPostLikes({ postId, authUserId, page });
      return result;
    } catch (err) {
      throw err;
    }
  });
