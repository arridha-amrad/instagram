import { TPost } from "@/fetchings/type";
import { sumComments } from "@/helpers/comments";
import db from "@/lib/drizzle/db";
import { unstable_cache } from "next/cache";
import { PostsTable } from "../schema";
import { eq, sql } from "drizzle-orm";

export type TUserPosts = {
  posts: TPost[];
  total: number;
  page: number;
};

type Args = {
  username: string;
  page: number;
};

const LIMIT = 3;

const fetchUserPosts = async ({
  username,
  page,
}: Args): Promise<TUserPosts> => {
  const user = await db.query.UsersTable.findFirst({
    where(fields, operators) {
      return operators.eq(fields.username, username);
    },
  });

  if (!user) {
    return {
      posts: [],
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
      return operators.eq(fields.userId, user.id);
    },
  }).then((result) => {
    return result.map((data) => ({
      ...data,
      sumComments: sumComments(data.comments),
      isLiked: !!data.likes.find((like) => like.userId === user.id),
      sumLikes: data.likes.length,
      comments: [],
    }));
  });
  return {
    posts,
    total: result.total,
    page,
  };
};

export const getUserPosts = unstable_cache(fetchUserPosts, ["user-posts"], {
  tags: ["fetchUserPosts"],
});
