import db from "@/lib/drizzle/db";
import { TReply } from "./type";

type Props = {
  commentId: string;
  userId?: string;
};

export const fetchReplies = async ({
  commentId,
  userId,
}: Props): Promise<TReply[]> => {
  const replies = await db.query.RepliesTable.findMany({
    orderBy(fields, operators) {
      return operators.asc(fields.createdAt);
    },
    where(fields, { eq }) {
      return eq(fields.commentId, commentId);
    },
    with: {
      likes: true,
      owner: {
        columns: {
          avatar: true,
          id: true,
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
    }));
  });

  return replies;
};
