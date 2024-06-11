import db from "@/lib/drizzle/db";
import {
  CommentsTable,
  PostLikesTable,
  PostsTable,
  UsersTable,
} from "@/lib/drizzle/schema";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { OWNER, POST } from "./constants";
import { TPost } from "./type";

export const fetchPosts = async (userId?: string) => {
  const startTime = new Date().getTime();

  const posts = await db
    .select({
      ...POST,
      owner: OWNER,
      sumLikes: sql<number>`${count(PostLikesTable.postId)}`.mapWith(Number),
    })
    .from(PostsTable)
    .orderBy(desc(PostsTable.createdAt))
    .innerJoin(UsersTable, eq(UsersTable.id, PostsTable.userId))
    .leftJoin(PostLikesTable, eq(PostLikesTable.postId, PostsTable.id))
    .groupBy(PostsTable.id, UsersTable.id);

  const placeHolderIsPostLiked = db
    .select()
    .from(PostLikesTable)
    .where(
      and(
        eq(PostLikesTable.postId, sql.placeholder("postId")),
        eq(PostLikesTable.userId, sql.placeholder("userId"))
      )
    )
    .prepare("placeHolderIsPostLiked");

  const placeholderSumComments = db
    .select({
      sumComment: sql<number>`count(${CommentsTable.id})`.mapWith(Number),
    })
    .from(CommentsTable)
    .where(eq(CommentsTable.postId, sql.placeholder("postId")))
    .prepare("placeholderSumComments");

  const myPosts: TPost[] = [];
  for (let index = 0; index < posts.length; index++) {
    const [isLiked] = await placeHolderIsPostLiked.execute({
      postId: posts[index].id,
      userId,
    });
    const [comments] = await placeholderSumComments.execute({
      postId: posts[index].id,
    });
    myPosts.push({
      ...posts[index],
      comments: [],
      isLiked: !!isLiked,
      sumComments: comments.sumComment,
    });
  }

  const endTime = new Date().getTime();
  console.log("fetching posts time : ", endTime - startTime, "ms");
  // console.log(JSON.stringify(myPosts, null, 2));

  return myPosts;
};
