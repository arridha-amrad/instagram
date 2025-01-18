"use server";

import { z } from "zod";
import { authActionClient } from "../safeAction";
import { redirect } from "next/navigation";

export const likePost = authActionClient
  .schema(
    z.object({
      pathname: z.string(),
      postId: z.string(),
    }),
  )
  .action(async ({ ctx: { session }, parsedInput: { pathname, postId } }) => {
    if (!session) {
      return redirect(`/login?cb_url=${pathname}`);
    }
    const { id: userId } = session.user;
  });
