import db from "@/lib/drizzle/db";
import ModalFollowings from "./ModalFollowings";

type Props = {
  username: string;
  total: number;
  userId: string;
};

const fetchFollowings = async (userId: string) => {
  const users = await db.query.FollowingsTable.findMany({
    columns: {},
    with: {
      follow: {
        columns: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
    },
    where(fields, operators) {
      return operators.eq(fields.userId, userId);
    },
  });
  return users;
};

const Followings = async ({ total, username, userId }: Props) => {
  const users = await fetchFollowings(userId);
  const followings = users.map((user) => user.follow);

  return (
    <ModalFollowings
      followings={followings}
      total={total}
      username={username}
    />
  );
};

export default Followings;
