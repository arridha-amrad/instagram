import db from "@/lib/drizzle/db";
import { TComment, TPost } from "./type";
import { unstable_cache } from "next/cache";
import { sumComments } from "@/helpers/comments";

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
      comments: [] as TComment[],
    }));
  });
  return posts;
};

export const fetchUserPosts = async (userId: string): Promise<TPost[]> => {
  const posts = await db.query.PostsTable.findMany({
    with: {
      owner: {
        columns: {
          avatar: true,
          email: true,
          id: true,
          name: true,
          username: true,
        },
      },
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
      sumComments: sumComments(data.comments),
      isLiked: !!data.likes.find((like) => like.userId === userId),
      sumLikes: data.likes.length,
      comments: [],
    }));
  });
  return posts;
};

export const getUserPosts = unstable_cache(fetchUserPosts, ["user-posts"], {
  tags: ["fetchUserPosts"],
});
