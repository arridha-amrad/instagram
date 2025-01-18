"use server";

import { TComment } from "@/lib/drizzle/queries/comments/fetchComments";
import CommentService from "@/lib/drizzle/services/CommentService";
import { authClient } from "@/lib/next-safe-action/init";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const create = authClient
  .schema(
    zfd.formData({
      message: zfd.text(z.string()),
    }),
  )
  .bindArgsSchemas<[postId: z.ZodString]>([z.string()])
  .action(
    async ({
      bindArgsParsedInputs: [postId],
      ctx: { userId, image, username },
      parsedInput: { message },
    }) => {
      const commentService = new CommentService();
      const [result] = await commentService.create({
        message,
        postId,
        userId,
      });
      const data: TComment = {
        ...result,
        avatar: image ?? null,
        isLiked: false,
        sumLikes: 0,
        sumReplies: 0,
        username,
      };
      return data;
    },
  );
