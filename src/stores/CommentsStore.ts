import { TComment, TReply } from "@/fetchings/type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";

type TLikeReplyArgs = {
  commentId: string;
  replyId: string;
};

type State = {
  comments: TComment[];
};

type Actions = {
  setComments: (comments: TComment[]) => void;
  addComment: (comment: TComment) => void;
  addReply: (reply: TReply) => void;
  likeComment: (commentId: string) => void;
  likeReply: ({ commentId, replyId }: TLikeReplyArgs) => void;
  setReplies: (commentId: string, replies: TReply[]) => void;
};

export const useCommentsStore = create<State & Actions>()(
  devtools(
    immer((set) => ({
      comments: [],
      likeReply({ commentId, replyId }: TLikeReplyArgs) {
        set((state) => {
          const comment = state.comments.find((c) => c.id === commentId);
          if (comment) {
            const rp = comment.replies.find((r) => r.id === replyId);
            if (rp) {
              if (rp.isLiked) {
                rp.isLiked = false;
                rp.sumLikes -= 1;
              } else {
                rp.isLiked = true;
                rp.sumLikes += 1;
              }
            }
          }
        });
      },
      setReplies(commentId, replies) {
        set((state) => {
          const comment = state.comments.find((c) => c.id === commentId);
          if (comment) {
            comment.replies = [...replies];
            comment.sumRepliesRemaining -= replies.length;
          }
        });
      },
      likeComment(commentId) {
        set((state) => {
          const comment = state.comments.find((c) => c.id === commentId);
          if (comment) {
            if (comment.isLiked) {
              comment.isLiked = false;
              comment.sumLikes -= 1;
            } else {
              comment.isLiked = true;
              comment.sumLikes += 1;
            }
          }
        });
      },
      setComments(comments) {
        set((state) => {
          state.comments = comments;
        });
      },
      addReply: (reply: TReply) => {
        set((state) => {
          const comment = state.comments.find((c) => c.id === reply.commentId);
          if (comment) {
            comment.replies.push(reply);
            comment.sumReplies += 1;
          }
        });
      },
      addComment(comment) {
        set((state) => {
          state.comments.unshift(comment);
        });
      },
    })),
    {
      enabled: process.env.NODE_ENV === "development",
      anonymousActionType: "useCommentStore",
      name: "Comments",
    },
  ),
);
