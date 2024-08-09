import db from "@/lib/drizzle/db";
import { PostsTable } from "@/lib/drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { TUserProfile } from "./type";

type Params = {
  username: string;
};

const fetchUser = async ({
  username,
}: Params): Promise<TUserProfile | null> => {
  //
  const user = await db.query.UsersTable.findFirst({
    with: {
      userInfo: true,
    },
    columns: {
      id: true,
      avatar: true,
      name: true,
    },
    where(fields, operators) {
      return operators.eq(fields.username, username);
    },
  });

  if (!user) return null;

  return user;
};

export const fetchUserProfileDetails = unstable_cache(
  fetchUser,
  ["fetchUserProfileDetails"],
  {
    tags: ["fetchUserProfileDetails"],
  },
);
