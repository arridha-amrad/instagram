import { CommentsTable, PostsTable, UsersTable } from "@/lib/drizzle/schema";

export type TOwner = Pick<
  typeof UsersTable.$inferSelect,
  "id" | "avatar" | "name" | "username"
>;

export type TComment = typeof CommentsTable.$inferSelect & { owner: TOwner };

export type TPost = typeof PostsTable.$inferSelect & {
  owner: TOwner;
  comments: TComment[];
  isLiked: boolean;
  sumLikes: number;
  sumComments: number;
};
