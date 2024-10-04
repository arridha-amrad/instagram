"use server";

import { removeAll } from "@/lib/drizzle/mutations/searchUser/removeAll";
import { revalidateTag } from "next/cache";
import { authClient } from "../init";

export const actionRemoveAllSearchHistories = authClient.action(
  async ({ ctx: { userId } }) => {
    await removeAll(userId);
    revalidateTag("fetchSearchHistories");
  },
);
