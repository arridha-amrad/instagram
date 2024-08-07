"use server";

import { fetchComments } from "@/lib/drizzle/queries/fetchComments";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";

const schema = z.object({
  postId: z.string(),
  authUserId: z.string().optional(),
  page: z.number(),
});

export const actionFetchComments = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { postId, authUserId, page } }) => {
    const comments = await fetchComments({
      page,
      postId,
      authUserId,
    });
    return comments;
  });
