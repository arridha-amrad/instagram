import NextAuth, { User } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { UsersTable } from "./lib/drizzle/schema";
import db from "./lib/drizzle/db";

const createToken = (token: JWT, user: User) => {
  const { id, image, name, username } = user;
  return {
    ...token,
    name,
    picture: image,
    sub: id,
    username,
  };
};

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
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
          email: credentials.email,
          image: credentials.image,
          username: credentials.username,
        };
        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.type === "credentials") {
        return true;
      }
      const { email: em, name, image } = user;
      if (em && name && image) {
        await db
          .insert(UsersTable)
          .values({
            email: em,
            username: `${em.split("@")[0]}`,
            avatar: image,
            name,
            password: "",
            provider:
              account?.provider === "google"
                ? "google"
                : account?.provider === "github"
                  ? "github"
                  : "facebook",
          })
          .onConflictDoNothing();
        return true;
      } else {
        return "/signin?e=invalid credentials";
      }
    },
    async jwt({ token, user, trigger, session, account }) {
      if (user && user.email) {
        if (account && account.provider !== "credentials") {
          const [dbUser] = await db
            .select({
              id: UsersTable.id,
              name: UsersTable.name,
              email: UsersTable.email,
              image: UsersTable.avatar,
              username: UsersTable.username,
            })
            .from(UsersTable)
            .where(eq(UsersTable.email, user.email));
          token = createToken(token, { ...dbUser, id: dbUser.id.toString() });
        } else {
          // construct token and avoid duplicate data
          // if user login with credentials provider
          token = createToken(token, user);
        }
      }

      if (trigger === "update" && session) {
        // see actions/updateUser returning value
        token = createToken(token, session);
        return token;
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      session.user = {
        id: token.sub as string,
        name: token.name as string,
        username: token.username as string,
        image: token.picture as string,
      } as User;
      return session;
    },
  },
});
