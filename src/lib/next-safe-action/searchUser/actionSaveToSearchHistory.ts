"use server";

import { z } from "zod";
import { authClient } from "../init";
import { save } from "@/lib/drizzle/mutations/searchUser/save";
import { revalidateTag } from "next/cache";

export const actionSaveToSearchHistory = authClient
  .schema(
    z.object({
      searchId: z.string(),
    }),
  )
  .action(async ({ ctx: { userId }, parsedInput: { searchId } }) => {
    await save({ authUserId: userId, searchId });
    revalidateTag("fetchSearchHistories");
  });
