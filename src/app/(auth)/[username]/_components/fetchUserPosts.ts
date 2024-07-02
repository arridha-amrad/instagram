import { TPost } from "@/fetchings/type";
import { sumComments } from "@/helpers/comments";
import db from "@/lib/drizzle/db";
import { unstable_cache } from "next/cache";

const fetchUserPosts = async (userId: string): Promise<TPost[]> => {
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
