"use server";

import db from "@/lib/drizzle/db";
import { CommentLikesTable } from "@/lib/drizzle/schema";
import { CustomServerError, authActionClient } from "@/lib/safe-action";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

type Props = {
  userId?: string;
  commentId: string;
};

export const likeCommentAction = authActionClient
  .schema(
    z.object({
      pathname: z.string(),
    }),
  )
  .bindArgsSchemas<
    [commentId: z.ZodString, pathname: z.ZodOptional<z.ZodString>]
  >([z.string(), z.string().optional()])
  .action(async ({ ctx: { userId }, bindArgsParsedInputs: [commentId] }) => {
    try {
      const [isLiked] = await db
        .select()
        .from(CommentLikesTable)
        .where(
          and(
            eq(CommentLikesTable.userId, userId),
            eq(CommentLikesTable.commentId, commentId),
          ),
        );
      if (isLiked) {
        await db
          .delete(CommentLikesTable)
          .where(
            and(
              eq(CommentLikesTable.userId, userId),
              eq(CommentLikesTable.commentId, commentId),
            ),
          );
      } else {
        await db.insert(CommentLikesTable).values({
          commentId,
          userId,
        });
      }
    } catch (err) {
      throw err;
    }
  });

export const _likeCommentAction = async (
  { commentId, userId }: Props,
  formData: FormData,
) => {
  if (!userId) {
    redirect("/login");
  }
  const [isLiked] = await db
    .select()
    .from(CommentLikesTable)
    .where(
      and(
        eq(CommentLikesTable.userId, userId),
        eq(CommentLikesTable.commentId, commentId),
      ),
    );
  if (isLiked) {
    await db
      .delete(CommentLikesTable)
      .where(
        and(
          eq(CommentLikesTable.userId, userId),
          eq(CommentLikesTable.commentId, commentId),
        ),
      );
  } else {
    await db.insert(CommentLikesTable).values({
      commentId,
      userId,
    });
  }
};
