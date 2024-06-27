import { TPost } from "@/fetchings/type";
import { StateCreator } from "zustand";
import { UserSlice } from "./user-slice";

export interface PostSlice {
  isLoadPosts: boolean;
  posts: TPost[];
  setPosts: (posts: TPost[]) => void;
  likePost: (postId: string) => void;
}

export const createPostSlice: StateCreator<
  UserSlice & PostSlice,
  [["zustand/devtools", never], ["zustand/immer", never]],
  [],
  PostSlice
> = (set) => ({
  posts: [],
  isLoadPosts: true,
  setPosts(posts) {
    set(() => ({ posts, isLoadPosts: false }));
  },
  likePost(postId) {
    set((state) => {
      const idx = state.posts.findIndex((p) => p.id === postId);
      if (idx >= 0) {
        if (state.posts[idx].isLiked) {
          state.posts[idx].isLiked = false;
          state.posts[idx].sumLikes -= 1;
        } else {
          state.posts[idx].isLiked = true;
          state.posts[idx].sumLikes += 1;
        }
      }
    });
  },
});
