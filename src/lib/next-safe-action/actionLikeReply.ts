"use server";

import { z } from "zod";
import { likeReply } from "../drizzle/mutations/likeReply";
import { authActionClient } from "./init";

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
