import db from "@/lib/drizzle/db";
import ModalFollowers from "./ModalFollowers";

type Props = {
  userId: string;
  total: number;
  username: string;
};

export default async function Followers({ total, userId, username }: Props) {
  const users = await db.query.FollowingsTable.findMany({
    columns: {},
    with: {
      user: {
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
  });

  const followers = users.map((user) => user.user);

  return (
    <ModalFollowers followers={followers} total={total} username={username} />
  );
}
