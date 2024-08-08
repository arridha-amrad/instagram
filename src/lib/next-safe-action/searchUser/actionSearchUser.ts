"use server";

import { findUsers } from "@/lib/drizzle/mutations/searchUser/findUsers";
import { z } from "zod";
import { optionalAuthActionClient } from "../init";

export const actionSearchUser = optionalAuthActionClient
  .schema(
    z.object({
      searchKey: z.string(),
    }),
  )
  .action(async ({ parsedInput: { searchKey } }) => {
    try {
      const result = await findUsers(searchKey);
      return result;
    } catch (err) {
      throw err;
    }
  });
