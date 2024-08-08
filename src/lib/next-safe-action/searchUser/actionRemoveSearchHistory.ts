"use server";

import { remove } from "@/lib/drizzle/mutations/searchUser/remove";
import { authActionClient } from "../init";
import { z } from "zod";
import { revalidateTag } from "next/cache";

export const actionRemoveSearchHistory = authActionClient
  .schema(
    z.object({
      searchId: z.string(),
    }),
  )
  .action(async ({ ctx: { userId }, parsedInput: { searchId } }) => {
    try {
      await remove({ authUserId: userId, searchId });
      revalidateTag("fetchSearchHistories");
    } catch (err) {
      throw err;
    }
  });
