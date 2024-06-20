import { TComment, TPost } from "@/fetchings/type";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
  post: TPost | null;
};

type Action = {
  setPost: (post: TPost) => void;
  setComment: (comments: TComment[]) => void;
};

export const usePostDetailStore = create<State & Action>()(
  devtools(
    immer((set) => ({
      post: null,
      setComment(comments) {
        set((state) => {
          if (state.post) {
            state.post.comments = comments;
          }
        });
      },
      setPost(post) {
        set((state) => {
          state.post = post;
        });
      },
    })),
    {
      anonymousActionType: "post_detail_store",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);
