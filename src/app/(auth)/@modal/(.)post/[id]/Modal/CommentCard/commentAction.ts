"use server";

import db from "@/lib/drizzle/db";
import { CommentLikesTable } from "@/lib/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

type Props = {
  userId?: string;
  commentId: string;
};

export const likeCommentAction = async (
  { commentId, userId }: Props,
  formData: FormData
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
        eq(CommentLikesTable.commentId, commentId)
      )
    );
  if (isLiked) {
    await db
      .delete(CommentLikesTable)
      .where(
        and(
          eq(CommentLikesTable.userId, userId),
          eq(CommentLikesTable.commentId, commentId)
        )
      );
  } else {
    await db.insert(CommentLikesTable).values({
      commentId,
      userId,
    });
  }
};
