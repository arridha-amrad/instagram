import { TPost } from "@/fetchings/type";
import db from "@/lib/drizzle/db";

type Params = {
  userId?: string;
  postId: string;
};

export const fetchPost = async ({ postId, userId }: Params): Promise<TPost | null> => {
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
        columns: {
          id: true,
        },
        orderBy(fields, operators) {
          return operators.desc(fields.createdAt);
        },
        with: {
          replies: true,
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
      return {
        ...data,
        isLiked: userId ? !!data.likes.find((like) => like.userId === userId) : false,
        sumLikes: data.likes.length,
        sumComments:
          data.comments.length +
          data.comments
            .map((c) => c.replies)
            .filter((r) => r.length > 0)
            .reduce((total, current) => total + current.length, 0),
        comments: [],
      };
    }
    return null;
  });
  return post;
};
