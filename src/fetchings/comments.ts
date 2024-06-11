import db from "@/lib/drizzle/db";
import {
  CommentLikesTable,
  CommentsTable,
  UsersTable,
} from "@/lib/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { COMMENT, OWNER } from "./constants";
import { TComment } from "./type";

export async function fetchComments({
  postId,
  userId,
}: {
  postId: string;
  userId?: string;
}): Promise<TComment[]> {
  // const comments = await db
  //   .select({
  //     ...COMMENT,
  //     owner: OWNER,
  //   })
  //   .from(CommentsTable)
  //   .limit(10)
  //   .orderBy(desc(CommentsTable.createdAt))
  //   .where(eq(CommentsTable.postId, postId))
  //   .innerJoin(UsersTable, eq(UsersTable.id, CommentsTable.userId));

  const comments = await db.query.CommentsTable.findMany({
    orderBy: ({ createdAt }, { desc }) => {
      return desc(createdAt);
    },
    where(fields, { eq }) {
      return eq(fields.postId, postId);
    },
    limit: 10,
    with: {
      likes: true,
      owner: {
        columns: {
          id: true,
          avatar: true,
          name: true,
          username: true,
        },
      },
    },
  }).then((data) => {
    return data.map((result) => ({
      ...result,
      isLiked: !userId
        ? false
        : !!result.likes.find((l) => l.userId === userId),
      sumLikes: result.likes.length,
    }));
  });
  console.log(JSON.stringify(comments, null, 2));
  return comments;
}
