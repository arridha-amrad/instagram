import db from "@/lib/drizzle/db";

const fetchSuggestedUsers = async (authUserId: string) => {
  const followings = await db.query.FollowingsTable.findMany({
    columns: {},
    with: {
      follow: {
        columns: {
          id: true,
        },
      },
    },
    where: ({ userId }, { eq }) => eq(userId, authUserId),
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
        ne(id, authUserId),
      ),
  });

  return users;
};

export default fetchSuggestedUsers;
