"use server";

import { findUsers } from "@/lib/drizzle/mutations/searchUser/findUsers";
import { z } from "zod";
import { optionalAuthClient } from "../init";
import { zfd } from "zod-form-data";

export const actionSearchUser = optionalAuthClient
  .schema(
    zfd.formData({
      searchKey: zfd.text(z.string()),
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
