import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      name: string;
      image: string;
      email: string;
    };
  }

  interface User {
    id: string;
    username: string;
    name: string;
    image: string;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    username: string;
    name: string;
    image: string;
    email: string;
  }
}
