import db from "@/lib/drizzle/db";

type Args = {
  userId: string;
  authUserId?: string;
};

export const fetchUserFollowers = async ({ authUserId, userId }: Args) => {
  const users = await db.query.FollowingsTable.findMany({
    columns: {},
    with: {
      user: {
        with: {
          followers: true,
        },
        columns: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
    },
    where(fields, { eq }) {
      return eq(fields.followId, userId);
    },
  }).then((result) =>
    result.map(({ user }) => {
      return {
        ...user,
        isFollow: !!user.followers.find(
          (f) => f.followId === user.id && f.userId === authUserId,
        ),
      };
    }),
  );

  return users;
};
