"use server";

import { z } from "zod";
import { fetchReplies } from "../drizzle/queries/fetchReplies";
import { optionalAuthClient } from "./init";

export const actionFetchReplies = optionalAuthClient
  .schema(
    z.object({
      commentId: z.string(),
      date: z.date(),
    }),
  )
  .action(async ({ parsedInput: { commentId, date }, ctx: { userId } }) => {
    try {
      const data = await fetchReplies({
        commentId,
        userId,
        date,
      });
      return data;
    } catch (err) {
      throw err;
    }
  });
