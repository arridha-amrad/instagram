import { TPost } from "@/lib/drizzle/queries/type";
import { StateCreator } from "zustand";
import { DetailSlice } from "./detailSlice";
import { FeedSlice } from "./feedSlice";

export type ProfileSlice = {
  totalProfilePosts: number;
  pageProfilePosts: number;
  profilePosts: TPost[];
  setProfilePosts: (posts: TPost[], total: number) => void;
};

export const createProfileSlice: StateCreator<
  DetailSlice & FeedSlice & ProfileSlice,
  [["zustand/devtools", never], ["zustand/immer", never]],
  [],
  ProfileSlice
> = (set) => ({
  profilePosts: [],
  pageProfilePosts: 0,
  totalProfilePosts: 0,
  setProfilePosts(posts, total) {
    set((state) => {
      state.profilePosts = posts;
      state.pageProfilePosts = 1;
      state.totalProfilePosts = total;
    });
  },
});
