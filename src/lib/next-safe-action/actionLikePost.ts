"use server";

import { authActionClient } from "@/lib/safe-action";
import { z } from "zod";
import { likePost } from "../drizzle/mutations/likePost";

export const actionLikePost = authActionClient
  .schema(
    z.object({
      postId: z.string(),
      pathname: z.string(),
    }),
  )
  .action(async ({ ctx: { userId }, parsedInput: { postId } }) => {
    try {
      await likePost({ postId, userId });
    } catch (err) {
      throw err;
    }
  });
