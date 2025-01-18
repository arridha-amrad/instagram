import { db } from "@/lib/drizzle/db";
import { asc, eq, sql } from "drizzle-orm";
import { RepliesTable, ReplyLikesTable, UsersTable } from "../../schema";
import crypto from "crypto";

const LIMIT = 5;

type Props = {
  commentId: string;
  userId?: string;
  page: number;
};

const query = async (commentId: string, page: number, userId?: string) => {
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
    .where(eq(RepliesTable.commentId, commentId))
    .leftJoin(ReplyLikesTable, eq(ReplyLikesTable.replyId, RepliesTable.id))
    .innerJoin(UsersTable, eq(UsersTable.id, RepliesTable.userId))
    .groupBy(RepliesTable.id, UsersTable.username, UsersTable.avatar)
    .orderBy(asc(RepliesTable.createdAt))
    .offset((page - 1) * LIMIT)
    .limit(LIMIT);
};

export type TReply = Awaited<ReturnType<typeof query>>[number];

export const fetchReplies = async ({
  commentId,
  userId,
  page,
}: Props): Promise<TReply[]> => {
  if (!userId) {
    userId = crypto.randomUUID();
  }
  const data = await query(commentId, page, userId);
  return data;
};
