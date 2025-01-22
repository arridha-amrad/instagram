import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import UserService from "./lib/drizzle/services/UserService";

type Provider = "credentials" | "facebook" | "github" | "google";

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
    async signIn({ user, account, credentials }) {
      if (credentials) {
        return true;
      }
      // if not using credentials provider
      // may be creating new user is necessary if the email is not registered
      const { email, name, image } = user;
      if (email && name && image && account?.provider) {
        const userService = new UserService();
        let provider = "" as Provider;
        switch (account.provider) {
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

    async jwt({ token, user, trigger, session, account, profile }) {
      if (account?.type === "oidc" && profile?.email) {
        const userService = new UserService();
        const [storedUser] = await userService.findUserByEmail(profile.email);
        const { avatar, email, id, name, username } = storedUser;
        token = {
          ...token,
          id,
          username,
          name,
          image: avatar,
          email,
        };
      }
      if (account?.type === "credentials") {
        // it will be the same as the return of provider->Credentials->authorize. see above
        // @ts-ignore
        token = {
          ...token,
          ...user,
        };
      }
      if (trigger === "update" && session) {
        token = {
          ...token,
          ...session,
        };
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      session.user.email = token.email as string;
      session.user.image = token.image as string;
      session.user.name = token.name as string;
      return session;
    },
  },
});
