"use server";

import db from "@/lib/drizzle/db";
import { PostLikesTable } from "@/lib/drizzle/schema";
import { and, eq } from "drizzle-orm";

type Args = {
  userId: string;
  postId: string;
};

export const likePostAction = async ({ postId, userId }: Args, prevState: any) => {
  try {
    let message = "";
    const isLiked = await db.query.PostLikesTable.findFirst({
      where: and(eq(PostLikesTable.postId, postId), eq(PostLikesTable.userId, userId)),
    });
    if (isLiked) {
      await db.delete(PostLikesTable).where(and(eq(PostLikesTable.postId, postId), eq(PostLikesTable.userId, userId)));
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
