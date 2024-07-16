"use server";

import { fetchPosts } from "@/app/(auth)/_components/fetchPosts";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";

export const loadPosts = actionClient
  .schema(
    z.object({
      userId: z.string().optional(),
      page: z.number(),
    }),
  )
  .action(async ({ parsedInput: { page, userId } }) => {
    const result = await fetchPosts({ page, userId });
    return result;
  });
