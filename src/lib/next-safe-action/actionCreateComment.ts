"use server";

import { zfd } from "zod-form-data";
import { authClient } from "./init";
import { z } from "zod";
import { createComment } from "@/lib/drizzle/mutations/createComment";
import { TComment } from "../drizzle/queries/fetchComments";

export const actionCreateComment = authClient
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
      try {
        const result = await createComment({
          postId,
          message,
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
      } catch (err) {
        throw err;
      }
    },
  );
