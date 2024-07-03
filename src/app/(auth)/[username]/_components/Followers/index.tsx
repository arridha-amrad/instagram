import db from "@/lib/drizzle/db";
import ModalFollowers from "./ModalFollowers";
import { auth } from "@/auth";

type Props = {
  userId: string;
  total: number;
  username: string;
};

export default async function Followers({ total, userId, username }: Props) {
  const session = await auth();
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
          (f) => f.followId === user.id && f.userId === session?.user.id,
        ),
      };
    }),
  );

  return <ModalFollowers followers={users} total={total} username={username} />;
}
