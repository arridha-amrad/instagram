"use server";

import { authActionClient } from "@/lib/safe-action";
import { z } from "zod";
import { likeComment } from "../drizzle/mutations/likeComment";

const schema = z.object({
  pathname: z.string(),
  commentId: z.string(),
});

export const actionLikeComment = authActionClient
  .schema(schema)
  .action(async ({ ctx: { userId }, parsedInput: { commentId } }) => {
    try {
      await likeComment({ authUserId: userId, commentId });
    } catch (err) {
      throw err;
    }
  });
