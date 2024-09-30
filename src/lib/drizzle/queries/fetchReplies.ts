import db from "@/lib/drizzle/db";
import { and, asc, eq, lt, sql } from "drizzle-orm";
import { RepliesTable, ReplyLikesTable, UsersTable } from "../schema";
import crypto from "crypto";

const LIMIT = 5;

type Props = {
  commentId: string;
  userId?: string;
  date?: Date;
};

const query = async (commentId: string, date: Date, userId?: string) => {
  return db
    .select({
      id: RepliesTable.id,
      userId: RepliesTable.userId,
      username: UsersTable.username,
      avatar: UsersTable.avatar,
      commentId: RepliesTable.commentId,
      message: RepliesTable.message,
      createdAt: RepliesTable.createdAt,
      updatedAt: RepliesTable.updatedAt,
      isLiked: sql<boolean>`
        CASE WHEN EXISTS (
          SELECT 1 FROM ${ReplyLikesTable}
          WHERE ${ReplyLikesTable.replyId} = ${RepliesTable.id}
          AND ${ReplyLikesTable.userId} = ${userId}
        ) 
          THEN true
          ELSE false
        END
      `,
      sumLikes: sql<number>`
        CAST(COUNT(DISTINCT ${ReplyLikesTable}) AS Int)
      `,
    })
    .from(RepliesTable)
    .where(
      and(
        eq(RepliesTable.commentId, commentId),
        lt(RepliesTable.createdAt, date),
      ),
    )
    .leftJoin(ReplyLikesTable, eq(ReplyLikesTable.replyId, RepliesTable.id))
    .innerJoin(UsersTable, eq(UsersTable.id, RepliesTable.userId))
    .groupBy(RepliesTable.id, UsersTable.username, UsersTable.avatar)
    .orderBy(asc(RepliesTable.createdAt))
    .limit(LIMIT);
};

export type TReply = Awaited<ReturnType<typeof query>>[number];

export const fetchReplies = async ({
  commentId,
  userId,
  date = new Date(),
}: Props): Promise<TReply[]> => {
  if (!userId) {
    userId = crypto.randomUUID();
  }
  const data = await query(commentId, date, userId);
  return data;
};
