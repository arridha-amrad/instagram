"use server";

import { zfd } from "zod-form-data";
import { authClient } from "./init";
import { z } from "zod";
import { createComment } from "@/lib/drizzle/mutations/createComment";

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
      ctx: { userId },
      parsedInput: { message },
    }) => {
      try {
        const result = await createComment({
          postId,
          message,
          userId,
        });
        return result;
      } catch (err) {
        throw err;
      }
    },
  );
