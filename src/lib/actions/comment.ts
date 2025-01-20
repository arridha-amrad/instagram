"use server";

import { z } from "zod";
import { zfd } from "zod-form-data";
import {
  fetchComments,
  TComment,
} from "../drizzle/queries/comments/fetchComments";
import CommentService from "../drizzle/services/CommentService";
import { authActionClient } from "../safeAction";

export const create = authActionClient
  .schema(
    zfd.formData({
      message: zfd.text(z.string()),
    }),
  )
  .bindArgsSchemas<[postId: z.ZodString, pathname: z.ZodString]>([
    z.string(),
    z.string(),
  ])
  .action(
    async ({
      bindArgsParsedInputs: [postId],
      ctx: { session },
      parsedInput: { message },
    }) => {
      const { id: userId, username, image } = session.user;
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

export const likeComment = authActionClient
  .schema(
    z.object({
      commentId: z.string(),
    }),
  )
  .bindArgsSchemas<[pathname: z.ZodString]>([z.string()])
  .action(async ({ ctx: { session }, parsedInput: { commentId } }) => {
    const userId = session.user.id;
    const commentService = new CommentService();
    const likeRows = await commentService.findLike({ commentId, userId });
    if (likeRows.length === 0) {
      await commentService.like({ commentId, userId });
    } else {
      await commentService.disLike({ commentId, userId });
    }
  });

export const loadMoreComments = authActionClient
  .schema(
    z.object({
      postId: z.string(),
      date: z.date(),
    }),
  )
  .bindArgsSchemas<[pathname: z.ZodString]>([z.string()])
  .action(async ({ ctx: { session }, parsedInput: { date, postId } }) => {
    const comments = await fetchComments({
      postId,
      userId: session.user.id,
      date,
    });
    return comments;
  });
