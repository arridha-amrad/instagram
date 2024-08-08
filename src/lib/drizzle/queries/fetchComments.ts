import db from "@/lib/drizzle/db";
import { TComment, TInfiniteResult, TReply } from "@/lib/drizzle/queries/type";
import { CommentsTable } from "@/lib/drizzle/schema";
import { and, eq, lte, sql } from "drizzle-orm";

const LIMIT = 10;

type Args = {
  postId: string;
  authUserId?: string;
  page: number;
  date?: Date;
};

export async function fetchComments({
  postId,
  authUserId,
  page,
  date = new Date(),
}: Args): Promise<TInfiniteResult<TComment>> {
  //
  const [total] = await db
    .select({
      sum: sql<number>`cast(count(${CommentsTable.id}) as int)`,
    })
    .from(CommentsTable)
    .where(
      and(eq(CommentsTable.postId, postId), lte(CommentsTable.createdAt, date)),
    );

  const comments = await db.query.CommentsTable.findMany({
    orderBy: ({ createdAt }, { desc }) => {
      return desc(createdAt);
    },
    limit: LIMIT,
    offset: LIMIT * (page - 1),
    where(fields, { eq, lte }) {
      return and(eq(fields.postId, postId), lte(fields.createdAt, date));
    },
    with: {
      replies: {
        columns: {
          id: true,
        },
      },
      likes: true,
      owner: {
        columns: {
          id: true,
          avatar: true,
          username: true,
        },
      },
    },
  });

  const populatedComments = comments.map((comment) => {
    const cmt = {
      ...comment,
      isLiked: !!comment.likes.find((l) => l.userId === authUserId),
      sumLikes: comment.likes.length,
      sumReplies: comment.replies.length,
      sumRepliesRemaining: comment.replies.length,
      replies: {
        date,
        data: [] as TReply[],
        page: 0,
        total: comment.replies.length,
      },
    };
    const { likes, ...props } = cmt;
    return props;
  });

  return { date, data: populatedComments, total: total.sum, page };
}
