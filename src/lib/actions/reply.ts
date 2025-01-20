"use server";

import { z } from "zod";
import { zfd } from "zod-form-data";
import { fetchReplies, TReply } from "../drizzle/queries/replies/fetchReplies";
import ReplyService from "../drizzle/services/ReplyService";
import { authActionClient } from "../safeAction";

export const create = authActionClient
  .schema(
    zfd.formData({
      message: zfd.text(z.string()),
    }),
  )
  .bindArgsSchemas<[commentId: z.ZodString, pathname: z.ZodString]>([
    z.string(),
    z.string(),
  ])
  .action(
    async ({
      bindArgsParsedInputs: [commentId],
      ctx: { session },
      parsedInput: { message },
    }) => {
      const { id: userId, username, image } = session.user;
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

export const likeReply = authActionClient
  .schema(
    z.object({
      replyId: z.string(),
      pathname: z.string(),
    }),
  )
  .bindArgsSchemas<[pathname: z.ZodString]>([z.string()])
  .action(async ({ parsedInput: { replyId }, ctx: { session } }) => {
    const { id: userId } = session.user;
    const replyService = new ReplyService();
    const likeRows = await replyService.findLike({ replyId, userId });
    let message = "";
    if (likeRows.length === 0) {
      await replyService.like({ replyId, userId });
      message = "like";
    } else {
      await replyService.dislike({ replyId, userId });
      message = "dislike";
    }
    return message;
  });

export const loadMoreReplies = authActionClient
  .schema(
    z.object({
      commentId: z.string(),
      page: z.number(),
    }),
  )
  .bindArgsSchemas<[pathname: z.ZodString]>([z.string()])
  .action(async ({ ctx: { session }, parsedInput: { commentId, page } }) => {
    const data = await fetchReplies({
      commentId,
      userId: session.user.id,
      page,
    });
    return data;
  });
