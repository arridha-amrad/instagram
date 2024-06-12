import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";

type CommentTarget = {
  userId: string;
  username: string;
  commentId: string;
};

interface State {
  commentTarget: CommentTarget | null;
  setCommentTarget: (data: CommentTarget) => void;
  reset: () => void;
}

export const useReplySetter = create<State>()(
  devtools(
    immer((set) => ({
      commentTarget: null,
      setCommentTarget(data: CommentTarget) {
        set((state: State) => {
          state.commentTarget = data;
        });
      },
      reset() {
        set((state: State) => {
          state.commentTarget = null;
        });
      },
    })),
    {
      enabled: process.env.NODE_ENV === "development",
      anonymousActionType: "reply_setter",
    }
  )
);
