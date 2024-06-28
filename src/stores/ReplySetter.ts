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
  id: number;
  isFocusToCommentForm: boolean;
  setFocusToCommentForm: (isFocus: boolean) => void;
  setCommentTarget: (data: CommentTarget) => void;
  reset: () => void;
}

export const useReplySetter = create<State>()(
  devtools(
    immer((set) => ({
      commentTarget: null,
      id: 0,
      isFocusToCommentForm: false,
      setFocusToCommentForm(isFocus) {
        set((state) => {
          state.isFocusToCommentForm = isFocus;
        });
      },
      setCommentTarget(data: CommentTarget) {
        set((state: State) => {
          state.commentTarget = data;
          state.id = new Date().getTime();
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
      anonymousActionType: "useReplySetter",
    },
  ),
);
