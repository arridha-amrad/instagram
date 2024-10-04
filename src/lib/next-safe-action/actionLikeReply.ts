"use server";

import { z } from "zod";
import { likeReply } from "../drizzle/mutations/likeReply";
import { authClient } from "./init";

const schema = z.object({
  replyId: z.string(),
});

export const actionLikeReply = authClient
  .schema(schema)
  .action(async ({ ctx: { userId }, parsedInput: { replyId } }) => {
    try {
      await likeReply({ authUserId: userId, replyId });
    } catch (err) {
      throw err;
    }
  });
