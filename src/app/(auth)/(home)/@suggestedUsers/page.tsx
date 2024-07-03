import { auth } from "@/auth";
import db from "@/lib/drizzle/db";
import SuggestedUsers from "../../_components/SuggestedUsers";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  const uid = session?.user.id;
  if (!uid) {
    redirect("/login");
  }

  const followings = await db.query.FollowingsTable.findMany({
    columns: {},
    with: {
      follow: {
        columns: {
          id: true,
        },
      },
    },
    where: ({ userId }, { eq }) => eq(userId, uid),
  });

  const users = await db.query.UsersTable.findMany({
    columns: {
      id: true,
      avatar: true,
      username: true,
      name: true,
    },
    where: ({ id }, { notInArray, and, ne }) =>
      and(
        notInArray(
          id,
          followings.map((f) => f.follow.id),
        ),
        ne(id, uid),
      ),
  });

  return <SuggestedUsers users={users} />;
}
