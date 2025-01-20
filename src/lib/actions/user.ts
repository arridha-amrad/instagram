"use server";

import { z } from "zod";
import { actionClient, authActionClient } from "../safeAction";
import { zfd } from "zod-form-data";
import { redirect } from "next/navigation";
import CloudinaryService from "../CloudinaryService";
import UserService from "../drizzle/services/UserService";
import { revalidateTag } from "next/cache";
import { USERS } from "../cacheKeys";
import { searchUser as su } from "@/lib/drizzle/queries/users/searchUser";

export const searchUser = actionClient
  .schema(
    zfd.formData({
      key: zfd.text(z.string()),
    }),
  )
  .action(async ({ parsedInput: { key } }) => {
    const users = await su(key);
    return users;
  });

export const updateAvatar = authActionClient
  .schema(
    zfd.formData({
      image: zfd.file(),
    }),
  )
  .bindArgsSchemas<[pathname: z.ZodString]>([z.string()])
  .action(
    async ({
      ctx: { session },
      bindArgsClientInputs: [pathname],
      parsedInput: { image },
    }) => {
      if (!session) {
        return redirect(`/login?cb_url=${pathname}`);
      }
      const response = await CloudinaryService.upload(image, true);
      const userService = new UserService();
      const { id } = session.user;
      const [result] = await userService.updateUser(id, {
        avatar: response.secure_url,
      });
      return {
        id: result.id,
        name: result.name,
        image: result.email,
        username: result.username,
        email: result.email,
      };
    },
  );

export const saveUserToSearchHistory = authActionClient
  .schema(
    z.object({
      searchId: z.string(),
    }),
  )
  .bindArgsSchemas<[pathname: z.ZodString]>([z.string()])
  .action(async ({ ctx: { session }, parsedInput: { searchId } }) => {
    const userService = new UserService();
    const result = await userService.addUserToSearchHistory({
      userId: session.user.id,
      searchId,
    });

    revalidateTag(USERS.searchHistories);

    return result;
  });

export const removeAllSearchHistories = authActionClient
  .bindArgsSchemas<[pathname: z.ZodString]>([z.string()])
  .action(async ({ ctx: { session }, bindArgsParsedInputs: [pathname] }) => {
    if (!session) {
      return redirect(`/login?cb_url=${pathname}`);
    }
    const userService = new UserService();
    const result = await userService.removeAllUserFromSearchHistory(
      session.user.id,
    );
    revalidateTag(USERS.searchHistories);
    return result;
  });

export const removeUserFromSearchHistory = authActionClient
  .bindArgsSchemas<
    [searchId: z.ZodString, pathname: z.ZodString]
  >([z.string(), z.string()])
  .action(
    async ({
      ctx: { session },
      bindArgsParsedInputs: [searchId, pathname],
    }) => {
      if (!session) {
        return redirect(`/login?cb_url=${pathname}`);
      }
      const userService = new UserService();
      const result = await userService.removeUserFromSearchHistory({
        searchId,
        userId: session.user.id,
      });
      revalidateTag(USERS.searchHistories);
      return result;
    },
  );
