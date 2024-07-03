import db from "@/lib/drizzle/db";
import { FollowingsTable, UsersTable } from "@/lib/drizzle/schema";
import { and, eq, exists, inArray, notExists } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// tampilkan users yang tidak di follow oleh rasmus

// 954b9d75-23e3-437d-a128-b4e01ff0e556 -> bruno
// 4f70c468-ea07-4396-a6c0-609948f48e69 -> rasmus;

export const GET = async (request: NextRequest) => {
  const userId = "4f70c468-ea07-4396-a6c0-609948f48e69";

  // total users ada 8 orang
  const allUsers = await db.query.UsersTable.findMany({
    columns: {
      username: true,
    },
  });

  // saat ini rasmus mengikuti 5 orang
  const followingsUser = await db.query.FollowingsTable.findMany({
    columns: {},
    with: {
      follow: {
        columns: {
          username: true,
        },
      },
    },
    where(fields, { and, eq }) {
      return and(eq(fields.userId, userId));
    },
  });

  const username = followingsUser.map((v) => v.follow.username);

  // rasmus tidak mengikuti 3 orang termasuk ia sendiri
  const notFollowingsUser = await db.query.UsersTable.findMany({
    columns: {
      id: true,
      name: true,
    },
    where(fields, { and, ne, notInArray }) {
      return and(notInArray(fields.username, username), ne(fields.id, userId));
    },
  });

  return NextResponse.json({ allUsers, followingsUser, notFollowingsUser });
};
