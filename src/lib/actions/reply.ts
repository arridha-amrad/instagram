"use server";

import { z } from "zod";
import { zfd } from "zod-form-data";
import { TReply } from "../drizzle/queries/replies/fetchReplies";
import ReplyService from "../drizzle/services/ReplyService";
import { authClient } from "../next-safe-action/init";

export const create = authClient
  .schema(
    zfd.formData({
      message: zfd.text(z.string()),
    }),
  )
  .bindArgsSchemas<[commentId: z.ZodString]>([z.string()])
  .action(
    async ({
      bindArgsParsedInputs: [commentId],
      ctx: { userId, image, username },
      parsedInput: { message },
    }) => {
      const replyService = new ReplyService();
      const [result] = await replyService.create({
        commentId,
        message,
        userId,
      });
      const data: TReply = {
        avatar: image ?? null,
        username,
        isLiked: false,
        sumLikes: 0,
        ...result,
      };
      return data;
    },
  );
