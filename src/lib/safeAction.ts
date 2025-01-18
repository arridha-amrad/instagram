import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { SafeActionError } from "./errors/SafeActionError";
import { getAuth } from "./next.auth";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof SafeActionError) {
      return e.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await getAuth();
  return next({
    ctx: {
      session,
    },
  });
});
