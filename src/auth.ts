import NextAuth, { Session, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import UserService from "./lib/drizzle/services/UserService";
import { JWT } from "next-auth/jwt";

type Provider = "credentials" | "facebook" | "github" | "google";

const createToken = (token: JWT, user: Session["user"]) => {
  return {
    ...token,
    userId: user.id,
    username: user.username,
    email: user.email,
    picture: user.image,
    name: user.name,
  };
};

const providers = [
  GitHub,
  Google({
    authorization: {
      params: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
      },
    },
  }),
  Credentials({
    authorize: async (credentials: any) => {
      const user: User = {
        id: credentials.id,
        name: credentials.name,
        image: credentials.image,
        email: credentials.email,
        username: credentials.username,
      };
      return user;
    },
  }),
];

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.type === "credentials") {
        return true;
      }

      const { email, name, image } = user;
      if (email && name && image) {
        const userService = new UserService();

        let provider = "credentials" as Provider;
        switch (account?.provider) {
          case "facebook":
            provider = "facebook";
            break;
          case "github":
            provider = "github";
            break;
          default:
            provider = "google";
        }
        const userWithSameEmail = await userService.findUserByEmail(email);
        if (userWithSameEmail.length === 0) {
          await userService.createUser({
            email,
            name,
            provider: provider,
            username: `${email.split("@")[0]}`,
            avatar: image,
          });
        }
        return true;
      } else {
        return "/signin?e=invalid credentials";
      }
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token = createToken(token, user as Session["user"]);
      }
      if (trigger === "update" && session) {
        token = createToken(token, session);
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId as string;
      session.user.username = token.username as string;
      session.user.email = token.email as string;
      session.user.image = token.picture as string;
      session.user.name = token.name as string;
      return session;
    },
  },
});
