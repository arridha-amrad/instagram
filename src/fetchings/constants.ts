import { CommentsTable, PostsTable, UsersTable } from "@/lib/drizzle/schema";

export const OWNER = {
  id: UsersTable.id,
  username: UsersTable.username,
  name: UsersTable.name,
  avatar: UsersTable.avatar,
};

export const COMMENT = {
  id: CommentsTable.id,
  postId: CommentsTable.postId,
  message: CommentsTable.message,
  createdAt: CommentsTable.createdAt,
  updatedAt: CommentsTable.updatedAt,
};

export const POST = {
  id: PostsTable.id,
  userId: PostsTable.userId,
  description: PostsTable.description,
  location: PostsTable.location,
  urls: PostsTable.urls,
  createdAt: PostsTable.createdAt,
  updatedAt: PostsTable.updatedAt,
};
