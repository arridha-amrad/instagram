import db from "@/lib/drizzle/db";
import { TComment } from "./type";

export const fetchPosts = async (userId?: string) => {
  const startTime = new Date().getTime();
  const posts = await db.query.PostsTable.findMany({
    orderBy({ createdAt }, { desc }) {
      return desc(createdAt);
    },
    with: {
      likes: true,
      comments: true,
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
      sumComments: result.comments.length,
      comments: [] as TComment[],
    }));
  });
  const endTime = new Date().getTime();

  console.log("tc : ", endTime - startTime);

  return posts;
};
