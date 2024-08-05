import db from "@/lib/drizzle/db";
import { TComment, TInfiniteResult, TReply } from "@/lib/drizzle/queries/type";
import { CommentsTable } from "@/lib/drizzle/schema";
import { eq, sql } from "drizzle-orm";

const LIMIT = 10;

type Args = {
  postId: string;
  authUserId?: string;
  page: number;
};

export async function fetchComments({
  postId,
  authUserId,
  page,
}: Args): Promise<TInfiniteResult<TComment>> {
  //
  const [total] = await db
    .select({
      sum: sql<number>`cast(count(${CommentsTable.id}) as int)`,
    })
    .from(CommentsTable)
    .where(eq(CommentsTable.postId, postId));

  const comments = await db.query.CommentsTable.findMany({
    orderBy: ({ createdAt }, { desc }) => {
      return desc(createdAt);
    },
    limit: LIMIT,
    offset: LIMIT * (page - 1),
    where(fields, { eq }) {
      return eq(fields.postId, postId);
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
        data: [] as TReply[],
        page: 0,
        total: comment.replies.length,
      },
    };
    const { likes, ...props } = cmt;
    return props;
  });

  return { data: populatedComments, total: total.sum, page };
}
