"use server";

import db from "@/lib/drizzle/db";
import { ReplyLikesTable } from "@/lib/drizzle/schema";
import { and, eq } from "drizzle-orm";

type Args = {
  userId: string;
  replyId: string;
};

export default async function like({ replyId, userId }: Args, prevState: any) {
  try {
    const isLiked = await db.query.ReplyLikesTable.findFirst({
      where({ userId: uid, replyId: rId }, { and, eq }) {
        return and(eq(uid, userId), eq(rId, replyId));
      },
    });
    if (isLiked) {
      await db
        .delete(ReplyLikesTable)
        .where(
          and(
            eq(ReplyLikesTable.replyId, replyId),
            eq(ReplyLikesTable.userId, userId),
          ),
        );
    } else {
      await db.insert(ReplyLikesTable).values({
        replyId,
        userId,
      });
    }
    return {
      type: "success",
      message: "success",
    };
  } catch (err) {
    console.log(err);

    return {
      type: "error",
      message: "Something went wrong",
    };
  }
}
