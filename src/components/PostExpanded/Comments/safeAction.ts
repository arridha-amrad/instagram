"use server";

import { fetchComments } from "@/fetchings/comments";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";

const schema = z.object({
  postId: z.string(),
  userId: z.string().optional(),
  page: z.number(),
});

export const loadMoreComments = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { postId, userId, page } }) => {
    console.log({ postId, userId, page });

    const comments = await fetchComments({
      page,
      postId,
      userId,
    });
    return comments;
  });
