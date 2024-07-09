"use server";

import { TOwner } from "@/fetchings/type";
import db from "@/lib/drizzle/db";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";

export type User = {
  user: TOwner;
  isFollow: boolean;
};

const schema = z.object({
  postId: z.string(),
  userId: z.string(),
});

export const fetchLikes = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { postId, userId } }) => {
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
      const followings = await db.query.FollowingsTable.findMany({
        where(fields, operators) {
          return operators.eq(fields.userId, userId);
        },
      }).then((data) => data.map(({ followId }) => followId));
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
  });
