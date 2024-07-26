import { TPost } from "@/lib/drizzle/queries/type";
import { StateCreator } from "zustand";
import { FeedSlice } from "./feedSlice";
import { ProfileSlice } from "./profileSlice";

export type DetailSlice = {
  post: TPost | null;
  setPost: (post: TPost) => void;
};

export const createDetailSlice: StateCreator<
  DetailSlice & FeedSlice & ProfileSlice,
  [["zustand/devtools", never], ["zustand/immer", never]],
  [],
  DetailSlice
> = (set) => ({
  post: null,
  setPost(post) {
    set((state) => {
      state.post = post;
    });
  },
});
