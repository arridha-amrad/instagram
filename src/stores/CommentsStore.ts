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
  page: number;
  total: number;
};

type Actions = {
  setComments: (comments: TComment[], total: number) => void;
  addComment: (comment: TComment) => void;
  addReply: (reply: TReply) => void;
  likeComment: (commentId: string) => void;
  likeReply: ({ commentId, replyId }: TLikeReplyArgs) => void;
  setReplies: (commentId: string, replies: TReply[]) => void;
  addMoreComments: (comments: TComment[]) => void;
};

export const useCommentsStore = create<State & Actions>()(
  devtools(
    immer((set) => ({
      comments: [],
      page: 0,
      total: 0,
      addMoreComments(comments) {
        set((state) => {
          const newComments = [...state.comments, ...comments].filter((v, i, arr) => arr.findIndex((val) => val.id === v.id) === i)
          console.log({ newComments });
          state.comments = newComments;
          state.page += 1;
        });
      },
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
            comment.replies = [...comment.replies, ...replies];
            comment.sumRepliesRemaining =
              comment.sumReplies - comment.replies.length;
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
      setComments(comments, total) {
        set((state) => {
          state.comments = comments;
          state.total = total;
          state.page = 1;
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
