import { TPost } from "@/fetchings/type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";

type State = {
  posts: TPost[];
  isLoadPosts: boolean;
};

type Actions = {
  setPosts: (posts: TPost[]) => void;
  likePost: (post: TPost) => void;
};

export const usePostStore = create<State & Actions>()(
  devtools(
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
              currPost.sumLikes -= 1;
            } else {
              currPost.isLiked = true;
              currPost.sumLikes += 1;
            }
          }
        });
      },
    })),
    {
      anonymousActionType: "posts_store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);
