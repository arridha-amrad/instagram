"use server";

import { USERS } from "@/lib/cacheKeys";
import { UserInfoTable } from "@/lib/drizzle/schema";
import { TransactionManager } from "@/lib/drizzle/services/TransactionManager";
import UserInfoService from "@/lib/drizzle/services/UserInfoService";
import UserService from "@/lib/drizzle/services/UserService";
import { authActionClient } from "@/lib/safeAction";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

const schema = zfd.formData({
  name: zfd.text(z.string().min(1, { message: "name is required" })),
  website: zfd.text(z.string().optional()),
  occupation: zfd.text(z.string().optional()),
  bio: zfd.text(z.string().optional()),
  gender: zfd.text(z.enum(["female", "male"]).optional()),
});

export const updateProfile = authActionClient
  .schema(schema)
  .bindArgsSchemas<[pathname: z.ZodString]>([z.string()])
  .action(async ({ ctx: { session }, parsedInput: { name, ...props } }) => {
    const userId = session.user.id;
    const tm = new TransactionManager();

    const updateResponse = await tm.execute(async (tx) => {
      const userService = new UserService(tx);
      const userInfoService = new UserInfoService(tx);
      await userService.updateUser(userId, { name });
      const userInfoRow = await userInfoService.findByUserId(userId);

      if (userInfoRow.length === 0) {
        await userInfoService.create({
          userId,
          ...props,
        });
      } else {
        await userInfoService.update(userInfoRow[0].id, props);
      }
    });

    revalidateTag(USERS.profile);
    revalidateTag(USERS.profileDetails);

    return updateResponse;
  });
