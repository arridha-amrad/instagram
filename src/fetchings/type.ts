import {
  CommentsTable,
  PostsTable,
  RepliesTable,
  UserInfoTable,
  UsersTable,
} from "@/lib/drizzle/schema";
import { fetchUser } from "./user";
import { fetchSearchHistories } from "@/components/Sidebar/fetchSearchHistories";

export type TPostSchema = typeof PostsTable.$inferSelect;
export type TCommentSchema = typeof CommentsTable.$inferSelect;
export type TReplySchema = typeof RepliesTable.$inferSelect;

export type TOwner = Pick<
  typeof UsersTable.$inferSelect,
  "id" | "avatar" | "name" | "username"
>;

export type TFetchComments = {
  comments: TComment[];
  total: number;
  page: number;
};

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

export type TProfile = Awaited<ReturnType<typeof fetchUser>>;
export type TUserInfo = typeof UserInfoTable.$inferSelect;
export type TSearchUser = Awaited<
  ReturnType<typeof fetchSearchHistories>
>[number];
