"use server";

import db from "@/lib/drizzle/db";
import { CommentsTable } from "@/lib/drizzle/schema";
import { authActionClient } from "@/lib/next-safe-action/init";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const action = authActionClient
  .schema(
    zfd.formData({
      message: zfd.text(z.string()),
    }),
  )
  .bindArgsSchemas([z.string()])
  .action(
    async ({
      bindArgsParsedInputs: [postId],
      ctx: { userId },
      parsedInput: { message },
    }) => {
      try {
        const [newComment] = await db
          .insert(CommentsTable)
          .values({
            message,
            postId,
            userId,
          })
          .returning();
        return newComment;
      } catch (err) {
        throw err;
      }
    },
  );
