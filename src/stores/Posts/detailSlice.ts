import { TComment, TInfiniteResult, TPost } from "@/lib/drizzle/queries/type";
import { StateCreator } from "zustand";
import { FeedSlice } from "./feedSlice";
import { UserSlice } from "./userSlice";

export type DetailSlice = {
  isLoadingPost: boolean;
  post: TPost | null;
  setPost: (post: TPost) => void;
  resetPost: () => void;
  addMoreComments: (data: TInfiniteResult<TComment>) => void;
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
  addMoreComments(data) {
    set((state) => {
      const post = state.post;
      if (!post) return;
      const newComments = [...post.comments.data, ...data.data].filter(
        (v, i, arr) => arr.findIndex((a) => a.id === v.id) === i,
      );
      post.comments = {
        data: newComments,
        page: data.page,
        total: data.total,
      };
    });
  },
});
