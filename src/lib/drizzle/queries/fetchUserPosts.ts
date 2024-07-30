import { sumComments } from "@/helpers/comments";
import db from "@/lib/drizzle/db";
import { TInfiniteResult, TUserPost } from "@/lib/drizzle/queries/type";
import { eq, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { PostsTable } from "../schema";

type Args = {
  username: string;
  page: number;
};

const LIMIT = 6;

const fetchUserPosts = async ({
  username,
  page,
}: Args): Promise<TInfiniteResult<TUserPost>> => {
  const user = await db.query.UsersTable.findFirst({
    where(fields, operators) {
      return operators.eq(fields.username, username);
    },
  });

  if (!user) {
    return {
      data: [],
      total: 0,
      page: 1,
    };
  }

  const [result] = await db
    .select({
      total: sql<number>`cast(count(${PostsTable.id}) as int)`,
    })
    .from(PostsTable)
    .where(eq(PostsTable.userId, user.id));

  const posts = await db.query.PostsTable.findMany({
    limit: LIMIT,
    offset: LIMIT * (page - 1),
    columns: {
      id: true,
      urls: true,
    },
    with: {
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
      likes: {
        columns: {
          postId: true,
        },
      },
    },
    orderBy({ createdAt }, { desc }) {
      return desc(createdAt);
    },
    where({ userId }, { eq }) {
      return eq(userId, user.id);
    },
  });

  const populatedPosts = posts.map((post) => {
    const data: TUserPost = {
      id: post.id,
      urls: post.urls,
      sumLikes: post.likes.length,
      sumComments: sumComments(post.comments),
    };
    return data;
  });

  return {
    data: populatedPosts,
    page,
    total: result.total,
  };
};

export const getUserPosts = unstable_cache(fetchUserPosts, ["user-posts"], {
  tags: ["fetchUserPosts"],
});
