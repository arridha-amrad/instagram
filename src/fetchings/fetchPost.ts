import db from "@/lib/drizzle/db";
import { TComment, TPost } from "./type";
import { LIMIT } from "./constants";

type Params = {
  userId?: string;
  postId: string;
};

export const fetchPost = async ({
  postId,
  userId,
}: Params): Promise<TPost | null> => {
  const post = await db.query.PostsTable.findFirst({
    where({ id }, { eq }) {
      return eq(id, postId);
    },
    orderBy({ createdAt }, { desc }) {
      return desc(createdAt);
    },
    with: {
      likes: true,
      comments: {
        limit: LIMIT,
        orderBy(fields, operators) {
          return operators.desc(fields.createdAt);
        },
        with: {
          replies: true,
          likes: true,
          owner: {
            columns: {
              avatar: true,
              email: true,
              id: true,
              name: true,
              username: true,
            },
          },
        },
      },
      owner: {
        columns: {
          avatar: true,
          email: true,
          id: true,
          name: true,
          username: true,
        },
      },
    },
  }).then((data) => {
    if (data) {
      const myComments: TComment[] = [];
      for (const comment of data.comments) {
        const data: TComment = {
          ...comment,
          isLiked: userId
            ? !!comment.likes.find((like) => like.userId === userId)
            : false,
          sumLikes: comment.likes.length,
          sumReplies: comment.replies.length,
          sumRepliesRemaining: comment.replies.length,
          replies: [],
        };
        myComments.push(data);
      }
      return {
        ...data,
        isLiked: userId
          ? !!data.likes.find((like) => like.userId === userId)
          : false,
        sumLikes: data.likes.length,
        sumComments: data.comments.length,
        comments: myComments,
      };
    }
    return null;
  });
  return post;
};
