import db from "@/lib/drizzle/db";
import { PostsTable } from "@/lib/drizzle/schema";
import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const [result] = await db
    .select({
      total: sql<number>`cast(count(${PostsTable.id})as int)`,
    })
    .from(PostsTable);

  return NextResponse.json({ total: result.total }, { status: 200 });
};
