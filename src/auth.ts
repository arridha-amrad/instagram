import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import UserService from "./lib/drizzle/services/UserService";

type Provider = "credentials" | "facebook" | "github" | "google";

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
    async jwt({ token, user }) {
      if (user && user.id) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId as string;
      return session;
    },
  },
});
