import db from "@/lib/drizzle/db";
import {
  CommentsTable,
  PostLikesTable,
  PostsTable,
  UsersTable,
} from "@/lib/drizzle/schema";
import { count, desc, eq, sql } from "drizzle-orm";
import { COMMENT, OWNER, POST } from "./constants";

export const fetchPosts = async (userId?: string) => {
  const posts = db
    .select({
      // owner: OWNER,
      ...POST,
      sumLikes: sql<number>`${count(PostLikesTable.postId)}`.as("sum_likes"),
    })
    .from(PostsTable)
    .limit(10)
    .orderBy(desc(PostsTable.createdAt))
    // .innerJoin(UsersTable, eq(UsersTable.id, PostsTable.userId))
    .leftJoin(PostLikesTable, eq(PostLikesTable.postId, PostsTable.id))
    .groupBy(PostLikesTable.postId, PostsTable.id);
  return posts;
};

export const sqPosts = db
  .select({ ...POST })
  .from(PostsTable)
  .orderBy(desc(PostsTable.createdAt))
  .as("sqPosts");

const totalLikes = async () => {
  const countLikes = await db
    .select({
      postId: PostLikesTable.postId,
      sumLikes: sql<number>`${count(PostLikesTable.postId)}`,
    })
    .from(sqPosts)
    .leftJoin(PostLikesTable, eq(PostLikesTable.postId, sqPosts.id))
    .groupBy(PostLikesTable.postId, sqPosts.id);

  const sumLikes = countLikes.reduce<
    Record<string, (typeof countLikes)[number]>
  >((acc, curr) => {
    const postId = curr.postId!;
    acc[postId] = { ...curr };
    return acc;
  }, {});

  return sumLikes;
};

const totalComments = async () => {
  const countComments = await db
    .select({
      postId: CommentsTable.postId,
      sumComments: sql<number>`${count(CommentsTable.postId)}`,
    })
    .from(sqPosts)
    .leftJoin(CommentsTable, eq(CommentsTable.postId, sqPosts.id))
    .groupBy(sqPosts.id, CommentsTable.postId);

  const sumComments = countComments.reduce<
    Record<string, (typeof countComments)[number]>
  >((acc, curr) => {
    const postId = curr.postId!;
    acc[postId] = { ...curr };
    return acc;
  }, {});
  return sumComments;
};

const fetchComments = async () => {
  const getComments = await db
    .select({
      ...COMMENT,
      owner: OWNER,
    })
    .from(sqPosts)
    .leftJoin(CommentsTable, eq(CommentsTable.postId, sqPosts.id))
    .innerJoin(UsersTable, eq(UsersTable.id, sqPosts.userId));

  const comments = getComments.reduce<
    Record<string, (typeof getComments)[number][]>
  >((total, item) => {
    const postId = item.postId!;
    if (!total[postId]) {
      total[postId] = [{ ...item }];
    } else {
      total[postId].push({ ...item });
    }
    return total;
  }, {});
  return comments;
};

const getPosts = async () => {
  const posts = await db
    .select({
      id: sqPosts.id,
      userId: sqPosts.userId,
      description: sqPosts.description,
      location: sqPosts.location,
      urls: sqPosts.urls,
      createdAt: sqPosts.createdAt,
      updatedAt: sqPosts.updatedAt,
      owner: {
        ...OWNER,
      },
    })
    .from(sqPosts)
    .innerJoin(UsersTable, eq(UsersTable.id, sqPosts.userId));
  return posts;
};

export type TPost = Awaited<ReturnType<typeof getPosts>>[number];
export type TComment = Awaited<
  ReturnType<typeof fetchComments>
>[number][number];
export type TSumLikes = number;
export type TSumComments = number;

export type TPostComplete = TPost & { comments: TComment[] } & {
  sumLikes: TSumLikes;
} & { sumComments: TSumComments };

export const fetchPosts2 = async () => {
  const [p, sl, sc, c] = await Promise.all([
    getPosts(),
    totalLikes(),
    totalComments(),
    fetchComments(),
  ]);

  const posts: TPostComplete[] = [];

  for (let i = 0; i < p.length; i++) {
    // @ts-ignore
    posts[i] = { ...p[i] };
    posts[i].sumLikes = sl[p[i].id].sumLikes;
    posts[i].sumComments = sc[p[i].id].sumComments;
    posts[i].comments = c[p[i].id];
  }

  console.log(JSON.stringify(posts, null, 2));

  return posts;

  // console.log(JSON.stringify(p, null, 2));
  // console.log(JSON.stringify(sl, null, 2));
  // console.log(JSON.stringify(sc, null, 2));
  // console.log(JSON.stringify(c, null, 2));
  // return p;
};
