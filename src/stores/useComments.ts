import { TComment } from "@/lib/drizzle/queries/fetchComments";
import { TReply } from "@/lib/drizzle/queries/fetchReplies";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const uniqueComments = (currSeenIds: Set<string>, newComments: Comment[]) => {
  const newSeenIds = currSeenIds;
  const comments = [] as Comment[];
  for (const comment of newComments) {
    if (!currSeenIds.has(comment.id)) {
      comments.push(comment);
      newSeenIds.add(comment.id);
    }
  }
  return {
    newSeenIds,
    comments,
  };
};

const transform = (comments: TComment[]): Comment[] => {
  return comments.map((c) => ({ ...c, replies: [] as TReply[] }));
};

export type Comment = TComment & { replies: TReply[] };

interface ActionState {
  comments: Comment[];
  cIds: string[];
  total: number;
  cDate: Date;
  hasMore: boolean;
  setTotal: (val: number) => void;
  setComments: (comments: TComment[]) => void;
  addComments: (comments: TComment[]) => void;
  likeComment: (commentId: string) => void;
  setReplies: (replies: TReply[]) => void;
  addReply: (reply: TReply) => void;
  addComment: (comment: TComment) => void;
}

export const useComments = create<ActionState>()(
  devtools(
    immer((set) => ({
      comments: [],
      cIds: [],
      total: 0,
      hasMore: true,
      cDate: new Date(),
      addComment(comment) {
        const c: Comment = { ...comment, replies: [] };
        set((state) => {
          state.comments.unshift(c);
          state.total += 1;
        });
      },
      addReply(reply) {
        set((state) => {
          const c = state.comments.find((c) => c.id === reply.commentId);
          if (!c) return;
          c.replies.push(reply);
          c.sumReplies += 1;
          state.total += 1;
        });
      },
      setReplies(replies) {
        set((state) => {
          const cId = replies[0].commentId;
          const comment = state.comments.find((c) => c.id === cId);
          if (!comment) return;
          comment.replies = [...comment.replies, ...replies];
        });
      },
      setTotal(val) {
        set((state) => {
          state.total = val;
        });
      },
      likeComment(commentId) {
        set((state) => {
          const comment = state.comments.find((c) => c.id === commentId);
          if (!comment) return;
          if (comment.isLiked) {
            comment.isLiked = false;
            comment.sumLikes -= 1;
          } else {
            comment.isLiked = true;
            comment.sumLikes += 1;
          }
        });
      },
      setComments(comments) {
        set((state) => {
          state.hasMore = comments.length >= 10;
          state.comments = transform(comments);
          state.cIds = comments.map((c) => c.id);
          state.cDate = state.comments[state.comments.length - 1].createdAt;
        });
      },
      addComments(incomingComments) {
        set((state) => {
          state.hasMore = incomingComments.length >= 10;
          const { newSeenIds, comments } = uniqueComments(
            new Set(state.cIds),
            transform(incomingComments),
          );
          state.comments = [...state.comments, ...comments];
          state.hasMore = state.comments.length >= 10;
          state.cIds = Array.from(newSeenIds);
          state.cDate = state.comments[state.comments.length - 1].createdAt;
        });
      },
    })),
    {
      enabled: process.env.NODE_ENV === "development",
      anonymousActionType: "useComments",
    },
  ),
);
