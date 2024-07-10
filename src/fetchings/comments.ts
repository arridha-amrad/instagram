import db from "@/lib/drizzle/db";
import { TFetchComments } from "./type";
import { CommentsTable } from "@/lib/drizzle/schema";
import { eq, sql } from "drizzle-orm";

const LIMIT = 5;

type Args = {
  postId: string;
  userId?: string;
  page: number;
};

export async function fetchComments({
  postId,
  userId,
  page,
}: Args): Promise<TFetchComments> {
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
      replies: true,
      likes: true,
      owner: {
        columns: {
          id: true,
          avatar: true,
          name: true,
          username: true,
        },
      },
    },
  }).then((data) => {
    return data.map((result) => ({
      ...result,
      isLiked: !userId
        ? false
        : !!result.likes.find((l) => l.userId === userId),
      sumLikes: result.likes.length,
      sumReplies: result.replies.length,
      sumRepliesRemaining: result.replies.length,
      replies: [],
      page,
    }));
  });
  return { comments, total: total.sum, page };
}
