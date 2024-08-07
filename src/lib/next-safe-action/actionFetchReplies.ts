"use server";

import { z } from "zod";
import { fetchReplies } from "../drizzle/queries/fetchReplies";
import { optionalAuthActionClient } from "./init";

export const actionFetchReplies = optionalAuthActionClient
  .schema(
    z.object({
      commentId: z.string(),
      page: z.number(),
      authUserId: z.string().optional(),
    }),
  )
  .action(async ({ parsedInput: { commentId, page, authUserId } }) => {
    try {
      const data = await fetchReplies({
        commentId,
        page,
        userId: authUserId,
      });
      return data;
    } catch (err) {
      throw err;
    }
  });
