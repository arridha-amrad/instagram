"use server";

import db from "@/lib/drizzle/db";
import { PostLikesTable } from "@/lib/drizzle/schema";
import { and, eq } from "drizzle-orm";

export const likePostAction = async (prevState: any, formData: FormData) => {
  const { userId, postId } = Object.fromEntries(formData.entries()) as {
    userId: string;
    postId: string;
  };

  try {
    let message = "";
    const isLiked = await db.query.PostLikesTable.findFirst({
      where: and(
        eq(PostLikesTable.postId, postId),
        eq(PostLikesTable.userId, userId)
      ),
    });
    if (isLiked) {
      await db
        .delete(PostLikesTable)
        .where(
          and(
            eq(PostLikesTable.postId, postId),
            eq(PostLikesTable.userId, userId)
          )
        );
      message = "dislike";
    } else {
      await db.insert(PostLikesTable).values({
        postId,
        userId,
      });
      message = "like";
    }
    return {
      type: "success",
      message: message,
    };
  } catch (err) {
    console.log(err);
    return {
      type: "error",
      message: "Something went wrong",
    };
  }
};
