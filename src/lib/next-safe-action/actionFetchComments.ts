"use server";

import { fetchComments } from "@/lib/drizzle/queries/fetchComments";
import { z } from "zod";
import { optionalAuthActionClient } from "./init";

const schema = z.object({
  postId: z.string(),
  authUserId: z.string().optional(),
  date: z.date(),
});

export const actionFetchComments = optionalAuthActionClient
  .schema(schema)
  .action(async ({ parsedInput: { postId, authUserId, date } }) => {
    const comments = await fetchComments({
      postId,
      userId: authUserId,
      date,
    });
    return comments;
  });
