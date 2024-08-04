import { TPost } from "@/lib/drizzle/queries/type";
import { StateCreator } from "zustand";
import { FeedSlice } from "./feedSlice";
import { UserSlice } from "./userSlice";

export type DetailSlice = {
  isLoadingPost: boolean;
  post: TPost | null;
  setPost: (post: TPost) => void;
  resetPost: () => void;
};

export const createDetailSlice: StateCreator<
  DetailSlice & FeedSlice & UserSlice,
  [["zustand/devtools", never], ["zustand/immer", never]],
  [],
  DetailSlice
> = (set) => ({
  post: null,
  isLoadingPost: true,
  resetPost() {
    set((state) => {
      state.isLoadingPost = true;
      state.post = null;
    });
  },
  setPost(post) {
    set((state) => {
      state.post = post;
      state.isLoadingPost = false;
    });
  },
});
