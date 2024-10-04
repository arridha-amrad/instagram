"use server";

import { z } from "zod";
import { likeComment } from "../drizzle/mutations/likeComment";
import { authClient } from "./init";

const schema = z.object({
  pathname: z.string(),
  commentId: z.string(),
});

export const actionLikeComment = authClient
  .schema(schema)
  .action(async ({ ctx: { userId }, parsedInput: { commentId } }) => {
    try {
      await likeComment({ authUserId: userId, commentId });
    } catch (err) {
      throw err;
    }
  });
