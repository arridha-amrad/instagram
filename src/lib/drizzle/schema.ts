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
        table.provider
      ),
    };
  }
);
export const usersRelations = relations(UsersTable, ({ many }) => ({
  posts: many(PostsTable),
  likes: many(PostLikesTable),
  comments: many(CommentsTable),
}));

//===========================================================================
export const PostsTable = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  description: varchar("description"),
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
    userId: uuid("userId").notNull(),
    postId: uuid("postId").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.postId] }),
    };
  }
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
  userId: uuid("user_id").notNull(),
  postId: uuid("post_id").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const commentsRelations = relations(CommentsTable, ({ one, many }) => ({
  owner: one(UsersTable, {
    fields: [CommentsTable.userId],
    references: [UsersTable.id],
  }),
  likes: many(PostLikesTable),
  post: one(PostsTable, {
    fields: [CommentsTable.postId],
    references: [PostsTable.id],
  }),
}));
