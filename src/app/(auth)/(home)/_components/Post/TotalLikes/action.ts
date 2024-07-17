"use server";

import { TOwner } from "@/fetchings/type";
import fetchPostLikes from "@/lib/drizzle/queries/fetchPostLikes";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";

export type User = {
  user: TOwner;
  isFollow: boolean;
};

const schema = z.object({
  postId: z.string(),
  authUserId: z.string().optional(),
});

export const fetchLikes = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { postId, authUserId } }) => {
    const data = await fetchPostLikes({ postId, authUserId });
    return data;
  });
