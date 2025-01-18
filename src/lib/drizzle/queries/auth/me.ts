import { unstable_cache } from "next/cache";
import UserService from "../../services/UserService";
import { USERS } from "@/lib/cacheKeys";

export const getMe = unstable_cache(
  async (sessionUserId: string) => {
    const userService = new UserService();
    const [user] = await userService.findUserById(sessionUserId);
    return {
      name: user.name,
      image: user.avatar,
      username: user.username,
    };
  },
  [USERS.auth],
  {
    tags: [USERS.auth],
  },
);
