import { auth } from "@/auth";
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { redirect } from "next/navigation";
export const actionClient = createSafeActionClient();

export class CustomServerError extends Error {}

export const safeActionClient = createSafeActionClient({
  handleReturnedServerError(e) {
    if (e instanceof CustomServerError) {
      return e.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

export const authActionClient = safeActionClient
  // In this case, context is used for (fake) auth purposes.
  .use(async ({ next, bindArgsClientInputs, clientInput }) => {
    const session = await auth();
    console.log("middleware safe action : ", bindArgsClientInputs);
    console.log("middleware safe action : ", clientInput);

    // If the session is not found, we throw an error and stop execution here.
    if (!session) {
      // throw new CustomServerError("Session not found!");
      redirect("/login");
    }

    const userId = session.user.id;

    // If the session is not valid, we throw an error and stop execution here.
    if (!userId) {
      throw new CustomServerError("Session is not valid!");
    }

    // Here we return the context object for the next middleware in the chain/server code function.
    return next({
      ctx: {
        userId,
      },
    });
  });
