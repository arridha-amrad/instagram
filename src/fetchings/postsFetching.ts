import db from "@/lib/drizzle/db";
import { TComment } from "./type";

export const fetchPosts = async (userId?: string) => {
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
  return posts;
};

export const fetchUserPosts = async (userId: string) => {
  const posts = await db.query.PostsTable.findMany({
    with: {
      comments: {
        columns: {
          id: true,
        },
      },
      likes: true,
    },
    orderBy(fields, operators) {
      return operators.desc(fields.createdAt);
    },
    where(fields, operators) {
      return operators.eq(fields.userId, userId);
    },
  }).then((result) => {
    return result.map((data) => ({
      ...data,
      sumComments: data.comments.length,
      isLiked: !!data.likes.find((like) => like.userId === userId),
      sumLikes: data.likes.length,
    }));
  });
  return posts;
};
