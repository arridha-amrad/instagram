import { auth } from "@/auth";
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { redirect } from "next/navigation";

export class CustomServerError extends Error {}

export const actionClient = createSafeActionClient();

export const safeActionClient = createSafeActionClient({
  handleReturnedServerError(e) {
    if (e instanceof CustomServerError) {
      return e.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

export const authActionClient = safeActionClient.use(
  async ({ next, clientInput }) => {
    const session = await auth();

    if (!session) {
      let pathname = "/";
      if (clientInput instanceof FormData) {
        pathname = clientInput.get("pathname") as string;
      } else {
        pathname = (clientInput as any).pathname;
      }
      redirect(`/login?cbUrl=${pathname}`);
    }

    const userId = session.user.id;

    if (!userId) {
      throw new CustomServerError("Session is not valid!");
    }

    return next({
      ctx: {
        userId,
      },
    });
  },
);
