"use server";

import { authActionClient } from "@/lib/safe-action";
import { z } from "zod";
import { likeReply } from "../drizzle/mutations/likeReply";

const schema = z.object({
  replyId: z.string(),
});

export const actionLikeReply = authActionClient
  .schema(schema)
  .action(async ({ ctx: { userId }, parsedInput: { replyId } }) => {
    try {
      await likeReply({ authUserId: userId, replyId });
    } catch (err) {
      throw err;
    }
  });
