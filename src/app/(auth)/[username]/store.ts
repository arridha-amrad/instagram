import { TUserPost } from "@/lib/drizzle/queries/posts/fetchUserPosts";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface StateAction {
  setPosts: (data: TUserPost[]) => void;
  posts: TUserPost[];
}

export const useUserPosts = create<StateAction>()(
  devtools(immer((set) => ({}))),
);
