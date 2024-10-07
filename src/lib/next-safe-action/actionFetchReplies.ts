"use server";

import { z } from "zod";
import { fetchReplies } from "../drizzle/queries/fetchReplies";
import { optionalAuthClient } from "./init";

export const actionFetchReplies = optionalAuthClient
  .schema(
    z.object({
      commentId: z.string(),
      page: z.number(),
    }),
  )
  .action(async ({ parsedInput: { commentId, page }, ctx: { userId } }) => {
    try {
      const data = await fetchReplies({
        commentId,
        userId,
        page,
      });
      return data;
    } catch (err) {
      throw err;
    }
  });
