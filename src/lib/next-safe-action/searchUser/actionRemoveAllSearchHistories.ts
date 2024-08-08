"use server";

import { removeAll } from "@/lib/drizzle/mutations/searchUser/removeAll";
import { revalidateTag } from "next/cache";
import { authActionClient } from "../init";

export const actionRemoveAllSearchHistories = authActionClient.action(
  async ({ ctx: { userId } }) => {
    await removeAll(userId);
    revalidateTag("fetchSearchHistories");
  },
);
