import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type CommentTarget = {
  userId: string;
  username: string;
  commentId: string;
};

type State = {
  commentTarget: CommentTarget | null;
};

type Actions = {
  setCommentTarget: (data: CommentTarget) => void;
};

export const useReplySetter = create<State & Actions>()(
  immer((set) => ({
    commentTarget: null,
    setCommentTarget(data) {
      set((state) => {
        state.commentTarget = data;
      });
    },
  }))
);
