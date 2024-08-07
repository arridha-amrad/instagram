"use server";

import { zfd } from "zod-form-data";
import { authActionClient } from "./init";
import { z } from "zod";
import { createReply } from "@/lib/drizzle/mutations/createReply";

export const actionCreateReply = authActionClient
  .schema(
    zfd.formData({
      message: zfd.text(z.string()),
    }),
  )
  .bindArgsSchemas<[commentId: z.ZodString]>([z.string()])
  .action(
    async ({
      bindArgsParsedInputs: [commentId],
      ctx: { userId },
      parsedInput: { message },
    }) => {
      try {
        const result = await createReply({
          commentId,
          message,
          userId,
        });
        return result;
      } catch (err) {
        throw err;
      }
    },
  );
