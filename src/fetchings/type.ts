import {
  CommentsTable,
  PostsTable,
  RepliesTable,
  UsersTable,
} from "@/lib/drizzle/schema";
import { fetchUserPosts } from "./postsFetching";

export type TPostSchema = typeof PostsTable.$inferSelect;
export type TCommentSchema = typeof CommentsTable.$inferSelect;
export type TReplySchema = typeof RepliesTable.$inferSelect;

export type TOwner = Pick<
  typeof UsersTable.$inferSelect,
  "id" | "avatar" | "name" | "username"
>;

export type TProfile = TOwner & { sumPosts: number };

export type TComment = TCommentSchema & { owner: TOwner } & {
  isLiked: boolean;
  sumLikes: number;
  sumReplies: number;
  sumRepliesRemaining: number;
  replies: TReply[];
};

export type TPost = TPostSchema & {
  owner: TOwner;
  comments: TComment[];
  isLiked: boolean;
  sumLikes: number;
  sumComments: number;
};

export type TReply = TReplySchema & { owner: TOwner } & {
  isLiked: boolean;
  sumLikes: number;
};

export type TUserPost = Awaited<ReturnType<typeof fetchUserPosts>>[number];
