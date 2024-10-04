import { CustomServerError } from "@/helpers/CustomServerError";
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { redirect } from "next/navigation";
import { getAuth } from "../next.auth";

const client = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof CustomServerError) {
      return e.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

export const optionalAuthClient = client.use(async ({ next }) => {
  const session = await getAuth();
  return next({
    ctx: {
      userId: session?.user.id,
    },
  });
});

export const authClient = client.use(async ({ next, clientInput }) => {
  const session = await getAuth();

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
  const { username, email, image, name } = session.user;

  if (!userId) {
    throw new CustomServerError("Session is not valid!");
  }

  return next({
    ctx: {
      userId,
      username,
      email,
      image,
      name,
    },
  });
});
