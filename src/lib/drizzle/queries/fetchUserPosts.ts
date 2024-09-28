import db from "@/lib/drizzle/db";
import { TInfiniteResult } from "@/lib/drizzle/queries/type";
import { and, desc, eq, lt, sql } from "drizzle-orm";
import {
  CommentsTable,
  PostLikesTable,
  PostsTable,
  RepliesTable,
} from "../schema";

type Args = {
  username: string;
  date?: Date;
  total?: number;
};

const LIMIT = 6;

const queryTotal = async (userId: string) => {
  const [result] = await db
    .select({
      total: sql<number>`cast(count(${PostsTable.id}) as int)`,
    })
    .from(PostsTable)
    .where(eq(PostsTable.userId, userId));
  return result.total;
};

const query = async (userId: string, date: Date) => {
  return db
    .select({
      id: PostsTable.id,
      urls: PostsTable.urls,
      createdAt: PostsTable.createdAt,
      sumLikes: sql<number>`
        CAST(COUNT(DISTINCT ${PostLikesTable}) AS Int)
      `,
      sumComments: sql<number>`
        CAST(COUNT(DISTINCT ${RepliesTable.id}) AS Int) +
        CAST(COUNT(DISTINCT ${CommentsTable.id}) AS Int)
      `,
    })
    .from(PostsTable)
    .where(and(eq(PostsTable.userId, userId), lt(PostsTable.createdAt, date)))
    .leftJoin(PostLikesTable, eq(PostsTable.id, PostLikesTable.postId))
    .leftJoin(CommentsTable, eq(CommentsTable.postId, PostsTable.id))
    .leftJoin(RepliesTable, eq(RepliesTable.commentId, CommentsTable.id))
    .orderBy(desc(PostsTable.createdAt))
    .groupBy(PostsTable.id)
    .limit(LIMIT);
};

export type TUserPost = Awaited<ReturnType<typeof query>>[number];

export const fetchUserPosts = async ({
  username,
  date = new Date(),
  total = 0,
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
      date,
      page: 1,
    };
  }
  if (total === 0) {
    total = await queryTotal(user.id);
  }
  const data = await query(user.id, date);
  return {
    page: 1,
    data,
    total,
    date,
  };
};
