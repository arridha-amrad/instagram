import { TPost, TComment } from "@/fetchings/type";
import { sumComments } from "@/helpers/comments";
import db from "@/lib/drizzle/db";

export const fetchPosts = async (userId?: string): Promise<TPost[]> => {
  const posts = await db.query.PostsTable.findMany({
    orderBy({ createdAt }, { desc }) {
      return desc(createdAt);
    },
    with: {
      likes: true,
      comments: {
        columns: {
          id: true,
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
    return data.map((result) => ({
      ...result,
      isLiked: userId
        ? !!result.likes.find((like) => like.userId === userId)
        : false,
      sumLikes: result.likes.length,
      sumComments: sumComments(result.comments),
      sumCommentsOnly: result.comments.length,
      comments: [] as TComment[],
    }));
  });
  return posts;
};
