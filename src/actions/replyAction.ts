"use server";

import { fetchReplies } from "@/fetchings/replies";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";

const schema = z.object({
  commentId: z.string(),
  userId: z.string().optional(),
  page: z.number().optional(),
});

export const fetchRepliesAction = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { commentId, userId, page } }) => {
    const replies = await fetchReplies({
      commentId,
      userId,
      page,
    });
    return replies;
  });
