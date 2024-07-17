import { TPost, TComment } from "@/fetchings/type";
import { sumComments } from "@/helpers/comments";
import db from "@/lib/drizzle/db";
import { PostsTable } from "@/lib/drizzle/schema";
import { sql } from "drizzle-orm";

const LIMIT = 5;

type Args = {
  userId?: string;
  page: number;
};

const fetchPosts = async ({
  page,
  userId,
}: Args): Promise<{ posts: TPost[]; total: number; page: number }> => {
  const [result] = await db
    .select({
      total: sql<number>`cast(count(${PostsTable.id}) as int)`,
    })
    .from(PostsTable);

  const posts = await db.query.PostsTable.findMany({
    orderBy({ createdAt }, { desc }) {
      return desc(createdAt);
    },
    limit: LIMIT,
    offset: LIMIT * (page - 1),
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

  return {
    posts,
    total: result.total,
    page,
  };
};

export default fetchPosts;
