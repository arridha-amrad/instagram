"use server";

import { zfd } from "zod-form-data";
import { authClient } from "./init";
import { z } from "zod";
import { createReply } from "@/lib/drizzle/mutations/createReply";
import { TReply } from "../drizzle/queries/fetchReplies";

export const actionCreateReply = authClient
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
      try {
        const result = await createReply({
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
      } catch (err) {
        throw err;
      }
    },
  );
