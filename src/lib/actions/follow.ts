"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import FollowService from "../drizzle/services/FollowService";
import { authActionClient } from "../safeAction";

const schema = z.object({
  followId: z.string(),
  pathname: z.string(),
});

export const follow = authActionClient
  .schema(schema)
  .action(async ({ ctx: { session }, parsedInput: { followId, pathname } }) => {
    if (!session) {
      return redirect(`/login?cb_url?=${pathname}`);
    }
    const { id } = session.user;
    const followService = new FollowService();

    const rowExists = await followService.find({ followId, userId: id });
    let message = "";
    if (rowExists.length === 0) {
      await followService.create({ followId, userId: id });
      message = "follow";
    } else {
      await followService.delete({ followId, userId: id });
      message = "unFollow";
    }

    return message;
  });
