import { TOwner } from "@/fetchings/type";
import db from "@/lib/drizzle/db";

export type User = {
  user: TOwner;
  isFollow: boolean;
};

type Args = {
  postId: string;
  authUserId?: string;
};

const fetchPostLikes = async ({ postId, authUserId: auid }: Args) => {
  const likes = await db.query.PostLikesTable.findMany({
    columns: {},
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          avatar: true,
          username: true,
        },
      },
    },
    where({ postId: pId }, { eq, and }) {
      return and(eq(pId, postId));
    },
  }).then(async (users) => {
    const followings = auid
      ? await db.query.FollowingsTable.findMany({
          where(fields, operators) {
            return operators.eq(fields.userId, auid);
          },
        }).then((data) => data.map(({ followId }) => followId))
      : [];
    const result: User[] = [];
    for (const user of users) {
      const isFollow = !!followings.find((f) => f === user.user.id);
      result.push({
        user: user.user,
        isFollow,
      });
    }
    return result;
  });
  return likes;
};

export default fetchPostLikes;
