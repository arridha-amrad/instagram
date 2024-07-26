import {
  CommentsTable,
  PostsTable,
  RepliesTable,
  UserInfoTable,
  UsersTable,
} from "@/lib/drizzle/schema";
import { fetchUserProfile } from "./fetchUserProfile";
import { fetchSearchHistories } from "@/components/Sidebar/fetchSearchHistories";

export type TPostSchema = typeof PostsTable.$inferSelect;
export type TCommentSchema = typeof CommentsTable.$inferSelect;
export type TReplySchema = typeof RepliesTable.$inferSelect;

export type TOwner = Pick<
  typeof UsersTable.$inferSelect,
  "id" | "avatar" | "name" | "username"
>;

export type TOwnerIsFollow = TOwner & { isFollow: boolean };

export type TInfiniteResult<T> = {
  total: number;
  page: number;
} & {
  users: T;
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

export type TProfile = Awaited<ReturnType<typeof fetchUserProfile>>;
export type TUserInfo = typeof UserInfoTable.$inferSelect;
export type TSearchUser = Awaited<
  ReturnType<typeof fetchSearchHistories>
>[number];
