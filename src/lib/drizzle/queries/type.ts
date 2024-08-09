import {
  CommentsTable,
  PostsTable,
  RepliesTable,
  UserInfoTable,
  UsersTable,
} from "@/lib/drizzle/schema";

export type TPostSchema = typeof PostsTable.$inferSelect;
export type TCommentSchema = typeof CommentsTable.$inferSelect;
export type TReplySchema = typeof RepliesTable.$inferSelect;
export type TUserSchema = typeof UsersTable.$inferSelect;
export type TUserInfo = typeof UserInfoTable.$inferSelect;

export type TOwner = Pick<TUserSchema, "id" | "avatar" | "name" | "username">;

export type TInfiniteResult<T> = {
  total: number;
  page: number;
  date: Date;
} & {
  data: T[];
};

export type TUser = Pick<TUserSchema, "avatar" | "username" | "id">;

export type TComment = TCommentSchema & { owner: TUser } & {
  isLiked: boolean;
  sumLikes: number;
  sumReplies: number;
  sumRepliesRemaining: number;
  replies: TInfiniteResult<TReply>;
};
export type TPost = TPostSchema & {
  owner: TUser;
  comments: TInfiniteResult<TComment>;
  isLiked: boolean;
  sumLikes: number;
  sumComments: number;
};

export type TUserIsFollow = TUser & { name: string; isFollow: boolean };

export type TUserPost = Omit<
  TPostSchema,
  "createdAt" | "updatedAt" | "location" | "description" | "userId"
> & { sumLikes: number; sumComments: number };

export type TFeedComment = TCommentSchema & {
  username: string;
  isLiked: boolean;
};
export type TFeedPost = Omit<TPost, "comments"> & { comments: TFeedComment[] };

export type TReply = TReplySchema & { owner: TUser } & {
  isLiked: boolean;
  sumLikes: number;
};

export type TSearchUser = TUser & { name: string };
export type TUserProfile = { userInfo: TUserInfo | null } & Pick<
  TUserSchema,
  "name" | "avatar" | "id"
>;
