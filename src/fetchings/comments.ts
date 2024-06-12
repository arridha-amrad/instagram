import db from "@/lib/drizzle/db";
import { TComment } from "./type";

export async function fetchComments({
  postId,
  userId,
}: {
  postId: string;
  userId?: string;
}): Promise<TComment[]> {
  const comments = await db.query.CommentsTable.findMany({
    orderBy: ({ createdAt }, { desc }) => {
      return desc(createdAt);
    },
    where(fields, { eq }) {
      return eq(fields.postId, postId);
    },
    limit: 10,
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
    }));
  });
  // console.log(JSON.stringify(comments, null, 2));
  return comments;
}
