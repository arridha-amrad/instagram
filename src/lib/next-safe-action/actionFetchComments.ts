"use server";

import { fetchComments } from "@/lib/drizzle/queries/fetchComments";
import { z } from "zod";
import { optionalAuthActionClient } from "./init";

const schema = z.object({
  postId: z.string(),
  authUserId: z.string().optional(),
  page: z.number(),
});

export const actionFetchComments = optionalAuthActionClient
  .schema(schema)
  .action(async ({ parsedInput: { postId, authUserId, page } }) => {
    const comments = await fetchComments({
      page,
      postId,
      authUserId,
    });
    return comments;
  });
