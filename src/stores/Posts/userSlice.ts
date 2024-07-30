import { TUserPost } from "@/lib/drizzle/queries/type";
import { StateCreator } from "zustand";
import { DetailSlice } from "./detailSlice";
import { FeedSlice } from "./feedSlice";

export type UserSlice = {
  isLoadingUserPosts: boolean;
  totalUserPosts: number;
  pageUserPosts: number;
  userPosts: TUserPost[];
  setUserPosts: (posts: TUserPost[], total: number) => void;
  addUserPosts: (posts: TUserPost[]) => void;
};

export const createUserSlice: StateCreator<
  DetailSlice & FeedSlice & UserSlice,
  [["zustand/devtools", never], ["zustand/immer", never]],
  [],
  UserSlice
> = (set) => ({
  isLoadingUserPosts: true,
  userPosts: [],
  pageUserPosts: 0,
  totalUserPosts: 0,
  addUserPosts(posts) {
    set((state) => {
      state.userPosts = [...state.userPosts, ...posts].filter(
        (post, i, arr) => arr.findIndex((v) => v.id === post.id) === i,
      );
      state.pageUserPosts += 1;
    });
  },
  setUserPosts(posts, total) {
    set((state) => {
      state.userPosts = posts;
      state.pageUserPosts = 1;
      state.totalUserPosts = total;
      state.isLoadingUserPosts = false;
    });
  },
});
