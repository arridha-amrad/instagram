import { relations } from "drizzle-orm";
import {
  json,
  pgEnum,
  pgTable,
  primaryKey,
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

type PostContentUrl = {
  type: "image" | "video";
  url: string;
  publicId: string;
};

//===========================================================================
export const FollowersTable = pgTable(
  "followers",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => UsersTable.id),
    toId: uuid("to_id")
      .notNull()
      .references(() => UsersTable.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.toId] }),
    };
  },
);
export const FollowersRelation = relations(FollowersTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [FollowersTable.userId],
    references: [UsersTable.id],
  }),
  toUser: one(UsersTable, {
    fields: [FollowersTable.toId],
    references: [UsersTable.id],
  }),
}));

//===========================================================================
export const FollowingsTable = pgTable(
  "followings",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => UsersTable.id),
    toId: uuid("to_id")
      .notNull()
      .references(() => UsersTable.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.toId] }),
    };
  },
);
export const FollowingsRelation = relations(FollowingsTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [FollowingsTable.userId],
    references: [UsersTable.id],
  }),
  toUser: one(UsersTable, {
    fields: [FollowingsTable.toId],
    references: [UsersTable.id],
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
export const usersRelations = relations(UsersTable, ({ many }) => ({
  posts: many(PostsTable),
  likes: many(PostLikesTable),
  comments: many(CommentsTable),
  followers: many(FollowersTable),
  followings: many(FollowingsTable),
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
