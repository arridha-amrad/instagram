import { TPost } from "@/fetchings/type";
import { StateCreator } from "zustand";
import { FollowerSlice } from "./createFollowerSlice";
import { FollowingSlice } from "./createFollowingSlice";

export type PostSlice = {
  total: number;
  page: number;
  posts: TPost[];
  setPosts: (posts: TPost[], total: number) => void;
  addPost: (post: TPost) => void;
  isLoading: boolean;
};

export const createPostSlice: StateCreator<
  PostSlice & FollowerSlice & FollowingSlice,
  [["zustand/devtools", never], ["zustand/immer", never]],
  [],
  PostSlice
> = (set) => ({
  page: 0,
  total: 0,
  posts: [],
  isLoading: true,
  addPost(post) {
    set((state) => {
      state.posts.unshift(post);
      state.total += 1;
    });
  },
  setPosts(posts, total) {
    set((state) => {
      state.posts = posts;
      state.total = total;
      state.page = 1;
      state.isLoading = false;
    });
  },
});
