"use server";

import { fetchComments } from "@/lib/drizzle/queries/fetchComments";
import { z } from "zod";
import { optionalAuthClient } from "./init";

const schema = z.object({
  postId: z.string(),
  date: z.date(),
});

export const actionFetchComments = optionalAuthClient
  .schema(schema)
  .action(async ({ parsedInput: { postId, date }, ctx: { userId } }) => {
    const comments = await fetchComments({
      postId,
      userId,
      date,
    });
    return comments;
  });
