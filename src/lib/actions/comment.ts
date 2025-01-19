"use server";

import { redirect } from "next/navigation";
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
  .bindArgsSchemas<[postId: z.ZodString]>([z.string()])
  .action(
    async ({
      bindArgsParsedInputs: [postId],
      ctx: { session },
      parsedInput: { message },
    }) => {
      if (!session) {
        return redirect("/login");
      }
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
      pathname: z.string(),
    }),
  )
  .action(
    async ({ ctx: { session }, parsedInput: { commentId, pathname } }) => {
      if (!session) {
        return redirect(`/login?cb_url=${pathname}`);
      }
      const userId = session.user.id;
      const commentService = new CommentService();
      const likeRows = await commentService.findLike({ commentId, userId });
      if (likeRows.length === 0) {
        await commentService.like({ commentId, userId });
      } else {
        await commentService.disLike({ commentId, userId });
      }
    },
  );

export const loadMoreComments = authActionClient
  .schema(
    z.object({
      postId: z.string(),
      date: z.date(),
    }),
  )
  .bindArgsSchemas<[pathname: z.ZodString]>([z.string()])
  .action(
    async ({
      ctx: { session },
      bindArgsParsedInputs: [pathname],
      parsedInput: { date, postId },
    }) => {
      if (!session) {
        return redirect(`/login?cb_url=${pathname}`);
      }
      const comments = await fetchComments({
        postId,
        userId: session.user.id,
        date,
      });
      return comments;
    },
  );
