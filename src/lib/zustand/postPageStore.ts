import { TPost } from "@/lib/drizzle/queries/type";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
  post: TPost | null;
};

type Action = {
  setPost: (post: TPost) => void;
  likePost: (postId: string) => void;
};

export const usePostPageStore = create<State & Action>()(
  devtools(
    immer((set) => ({
      post: null,
      setPost(post) {
        set((state) => {
          state.post = post;
        });
      },
      likePost(postId) {
        set((state) => {
          if (postId === state.post?.id) {
            if (state.post.isLiked) {
              state.post.isLiked = false;
              state.post.sumLikes -= 1;
            } else {
              state.post.isLiked = true;
              state.post.sumLikes += 1;
            }
          }
        });
      },
    })),
    {
      anonymousActionType: "usePostStore",
      name: "Post Store",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);
