import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";

type CommentTarget = {
  userId: string;
  username: string;
  commentId: string;
};

export type TReplySetter = {
  username: string;
  commentId: string;
};

interface State {
  commentTarget: CommentTarget | null;
  id: number;
  isFocusToCommentForm: boolean;
  reply: TReplySetter | null;
}

interface Action {
  setFocusToCommentForm: (isFocus: boolean) => void;
  setCommentTarget: (data: CommentTarget) => void;
  setReply: (data: TReplySetter | null) => void;
  reset: () => void;
}

export const useReplySetter = create<State & Action>()(
  devtools(
    immer((set) => ({
      commentTarget: null,
      reply: null,
      setReply(data) {
        set((state) => {
          state.reply = data;
        });
      },
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
