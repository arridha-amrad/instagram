import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { TPost } from "./postsFetching";

type State = {
  posts: TPost[];
  isLoadPosts: boolean;
};

type Actions = {
  setPosts: (posts: TPost[]) => void;
  likePost: (post: TPost) => void;
};

export const usePostStore = create<State & Actions>()(
  immer((set) => ({
    posts: [],
    isLoadPosts: true,
    setPosts(posts) {
      set((state) => {
        state.posts = posts;
        state.isLoadPosts = false;
      });
    },
    likePost(post) {
      set((state) => {
        const currPost = state.posts.find((p) => p.id === post.id);
        if (currPost) {
          if (currPost.isLiked) {
            currPost.isLiked = false;
            currPost.likes -= 1;
          } else {
            currPost.isLiked = true;
            currPost.likes += 1;
          }
        }
      });
    },
  }))
);
