import { sumComments } from "@/helpers/comments";
import db from "@/lib/drizzle/db";
import {
  TFeedComment,
  TFeedPost,
  TInfiniteResult,
} from "@/lib/drizzle/queries/type";
import { PostsTable } from "@/lib/drizzle/schema";
import { lte, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

const LIMIT = 5;

type Args = {
  userId?: string;
  page: number;
  date?: Date;
};

const fetchPosts = async ({
  page,
  userId,
  date = new Date(),
}: Args): Promise<TInfiniteResult<TFeedPost>> => {
  //
  const getTotal = async () => {
    const [result] = await db
      .select({
        total: sql<number>`cast(count(${PostsTable.id}) as int)`,
      })
      .from(PostsTable)
      .where(lte(PostsTable.createdAt, date));
    return result.total;
  };

  const getPosts = async () => {
    const posts = await db.query.PostsTable.findMany({
      where({ createdAt }, { lte }) {
        return lte(createdAt, date);
      },
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
    });
    return posts;
  };

  const [total, posts] = await Promise.all([getTotal(), getPosts()]);

  const data = posts.map((post) => {
    const feedPost = {
      ...post,
      isLiked: !!post.likes.find((like) => like.userId === userId),
      sumComments: sumComments(post.comments),
      comments: [] as TFeedComment[],
      sumLikes: post.likes.length,
    };
    const { likes, ...props } = feedPost;
    return props;
  });

  return {
    date,
    data,
    total,
    page,
  };
};

export const fetchFeedPosts = unstable_cache(fetchPosts, ["fetchFeedPosts"], {
  tags: ["fetchFeedPosts"],
});
