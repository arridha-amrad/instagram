import { TPost } from "@/fetchings/type";
import { sumComments } from "@/helpers/comments";
import db from "@/lib/drizzle/db";

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
        columns: {
          id: true,
        },
        orderBy(fields, operators) {
          return operators.desc(fields.createdAt);
        },
        with: {
          replies: {
            columns: {
              id: true,
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
      return {
        ...data,
        isLiked: userId
          ? !!data.likes.find((like) => like.userId === userId)
          : false,
        sumLikes: data.likes.length,
        sumComments: sumComments(data.comments),
        sumCommentsOnly: data.comments.length,
        comments: [],
      };
    }
    return null;
  });
  return post;
};
