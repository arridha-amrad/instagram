import db from "@/lib/drizzle/db";
import { TInfiniteResult, TReply } from "./type";
import { RepliesTable } from "../schema";
import { and, eq, lte, sql } from "drizzle-orm";

const LIMIT = 5;

type Props = {
  commentId: string;
  userId?: string;
  page?: number;
  date?: Date;
};

export const fetchReplies = async ({
  commentId,
  userId,
  page = 1,
  date = new Date(),
}: Props): Promise<TInfiniteResult<TReply>> => {
  const [res] = await db
    .select({
      sum: sql<number>`cast(count(${RepliesTable.id}) as int)`,
    })
    .from(RepliesTable)
    .where(
      and(
        eq(RepliesTable.commentId, commentId),
        lte(RepliesTable.createdAt, date),
      ),
    );
  //
  const replies = await db.query.RepliesTable.findMany({
    orderBy(fields, operators) {
      return operators.asc(fields.createdAt);
    },
    where(fields, { eq }) {
      return eq(fields.commentId, commentId);
    },
    limit: 5,
    offset: LIMIT * (page - 1),
    with: {
      likes: true,
      owner: {
        columns: {
          avatar: true,
          id: true,
          username: true,
        },
      },
    },
  });

  const populatedReplies = replies.map((rpl) => {
    const reply = {
      ...rpl,
      isLiked: !!rpl.likes.find((l) => l.userId === userId),
      sumLikes: rpl.likes.length,
    };
    const { likes, ...props } = reply;
    return props;
  });

  return {
    date,
    data: populatedReplies,
    page,
    total: res.sum,
  };
};
