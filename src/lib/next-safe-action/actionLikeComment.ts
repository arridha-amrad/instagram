"use server";

import { z } from "zod";
import { likeComment } from "../drizzle/mutations/likeComment";
import { authActionClient } from "./init";

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
