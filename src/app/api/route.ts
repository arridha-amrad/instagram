import db from "@/lib/drizzle/db";
import { PostsTable } from "@/lib/drizzle/schema";
import { desc, lte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

const query = db
  .select()
  .from(PostsTable)
  .where(lte(PostsTable.createdAt, sql.placeholder("date")))
  .orderBy(desc(PostsTable.createdAt))
  .limit(5)
  .prepare("query_feed_posts");

export const GET = async (req: Request) => {
  const date = new Date("2024-06-29T06:31:21.144Z");
  const userId = "4f70c468-ea07-4396-a6c0-609948f48e69";

  const posts = await query.execute({ date });

  return NextResponse.json(posts);
};
