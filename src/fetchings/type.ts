import {
  CommentsTable,
  PostsTable,
  RepliesTable,
  UsersTable,
} from "@/lib/drizzle/schema";

export type TOwner = Pick<
  typeof UsersTable.$inferSelect,
  "id" | "avatar" | "name" | "username"
>;

export type TComment = typeof CommentsTable.$inferSelect & { owner: TOwner } & {
  isLiked: boolean;
  sumLikes: number;
  sumReplies: number;
  sumRepliesRemaining: number;
  replies: TReply[];
};

export type TReply = typeof RepliesTable.$inferSelect & { owner: TOwner } & {
  isLiked: boolean;
  sumLikes: number;
};

export type TPost = typeof PostsTable.$inferSelect & {
  owner: TOwner;
  comments: TComment[];
  isLiked: boolean;
  sumLikes: number;
  sumComments: number;
};
