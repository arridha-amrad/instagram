import { relations } from "drizzle-orm";
import {
  index,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const providerEnum = pgEnum("provider_enum", [
  "credentials",
  "github",
  "google",
  "facebook",
]);

export const genderEnum = pgEnum("gender_enum", ["male", "female"]);

type PostContentUrl = {
  type: "image" | "video";
  url: string;
  publicId: string;
};

//===========================================================================
export const SearchUsersTable = pgTable(
  "search_users",
  {
    userId: uuid("user_id")
      .references(() => UsersTable.id)
      .notNull(),
    searchId: uuid("search_id")
      .references(() => UsersTable.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.searchId, table.userId] }),
    user: index("relations_search_users_user_idx").on(table.userId),
    search: index("relations_search_users_search_idx").on(table.searchId),
  }),
);
export const SearchUsersRelation = relations(SearchUsersTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [SearchUsersTable.userId],
    references: [UsersTable.id],
    relationName: "searchedBy",
  }),
  searchUser: one(UsersTable, {
    fields: [SearchUsersTable.searchId],
    references: [UsersTable.id],
    relationName: "searchFor",
  }),
}));

//===========================================================================
export const UserInfoTable = pgTable(
  "user_info",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .references(() => UsersTable.id)
      .notNull(),
    website: varchar("website"),
    occupation: varchar("occupation"),
    bio: text("bio"),
    gender: genderEnum("gender"),
  },
  (table) => ({
    uniqueUser: uniqueIndex("userIndex").on(table.userId),
  }),
);
export const UserInfoRelation = relations(UserInfoTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [UserInfoTable.userId],
    references: [UsersTable.id],
  }),
}));

//===========================================================================
export const FollowingsTable = pgTable(
  "followings_table",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => UsersTable.id, { onDelete: "cascade" }),
    followId: uuid("follow_id")
      .notNull()
      .references(() => UsersTable.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.followId] }),
      user: index("relations_user_idx").on(table.userId),
      follow: index("relations_follow_idx").on(table.followId),
    };
  },
);
export const FollowingsRelation = relations(FollowingsTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [FollowingsTable.userId],
    references: [UsersTable.id],
    relationName: "followings",
  }),
  follow: one(UsersTable, {
    fields: [FollowingsTable.followId],
    references: [UsersTable.id],
    relationName: "followers",
  }),
}));

//===========================================================================
export const UsersTable = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
    username: varchar("username").notNull(),
    email: varchar("email").notNull(),
    avatar: text("avatar"),
    password: text("password"),
    provider: providerEnum("provider").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      uniqueUsername: uniqueIndex("usernameIndex").on(table.username),
      uniqueEmail: uniqueIndex("emailIndex").on(table.email),
      uniqueEmailAndProvider: unique("emailAndProvider").on(
        table.email,
        table.provider,
      ),
    };
  },
);
export const usersRelations = relations(UsersTable, ({ many, one }) => ({
  userInfo: one(UserInfoTable),
  posts: many(PostsTable),
  likes: many(PostLikesTable),
  comments: many(CommentsTable),
  followers: many(FollowingsTable, { relationName: "followers" }),
  followings: many(FollowingsTable, { relationName: "followings" }),
  searchUsers: many(SearchUsersTable, { relationName: "searchFor" }),
}));

//===========================================================================
export const PostsTable = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => UsersTable.id),
  description: text("description"),
  location: varchar("location"),
  urls: json("urls").$type<PostContentUrl[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const postsRelations = relations(PostsTable, ({ one, many }) => ({
  owner: one(UsersTable, {
    fields: [PostsTable.userId],
    references: [UsersTable.id],
  }),
  likes: many(PostLikesTable),
  comments: many(CommentsTable),
}));

//===========================================================================
export const PostLikesTable = pgTable(
  "likes",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => UsersTable.id),
    postId: uuid("post_id")
      .notNull()
      .references(() => PostsTable.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.postId] }),
    };
  },
);
export const likesRelations = relations(PostLikesTable, ({ one }) => ({
  post: one(PostsTable, {
    fields: [PostLikesTable.postId],
    references: [PostsTable.id],
  }),
  user: one(UsersTable, {
    fields: [PostLikesTable.userId],
    references: [UsersTable.id],
  }),
}));

//===========================================================================
export const CommentsTable = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => UsersTable.id),
  postId: uuid("post_id")
    .notNull()
    .references(() => PostsTable.id),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const commentsRelations = relations(CommentsTable, ({ one, many }) => ({
  owner: one(UsersTable, {
    fields: [CommentsTable.userId],
    references: [UsersTable.id],
  }),
  post: one(PostsTable, {
    fields: [CommentsTable.postId],
    references: [PostsTable.id],
  }),
  likes: many(CommentLikesTable),
  replies: many(RepliesTable),
}));

//===========================================================================
export const CommentLikesTable = pgTable(
  "comment_likes",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => UsersTable.id),
    commentId: uuid("comment_id")
      .notNull()
      .references(() => CommentsTable.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.commentId, table.userId] }),
    };
  },
);
export const commentLikesRelations = relations(
  CommentLikesTable,
  ({ one }) => ({
    comment: one(CommentsTable, {
      fields: [CommentLikesTable.commentId],
      references: [CommentsTable.id],
    }),
    user: one(UsersTable, {
      fields: [CommentLikesTable.userId],
      references: [UsersTable.id],
    }),
  }),
);

//===========================================================================
export const RepliesTable = pgTable("replies", {
  id: uuid("id").primaryKey().defaultRandom(),
  message: text("message").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => UsersTable.id),
  commentId: uuid("comment_id")
    .notNull()
    .references(() => CommentsTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const repliesTableRelations = relations(
  RepliesTable,
  ({ one, many }) => ({
    owner: one(UsersTable, {
      fields: [RepliesTable.userId],
      references: [UsersTable.id],
    }),
    comment: one(CommentsTable, {
      fields: [RepliesTable.commentId],
      references: [CommentsTable.id],
    }),
    likes: many(ReplyLikesTable),
  }),
);

//===========================================================================
export const ReplyLikesTable = pgTable(
  "reply_likes",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => UsersTable.id),
    replyId: uuid("reply_id")
      .notNull()
      .references(() => RepliesTable.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.replyId, table.userId] }),
  }),
);
export const replyLikesRelations = relations(ReplyLikesTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [ReplyLikesTable.userId],
    references: [UsersTable.id],
  }),
  reply: one(RepliesTable, {
    fields: [ReplyLikesTable.replyId],
    references: [RepliesTable.id],
  }),
}));
