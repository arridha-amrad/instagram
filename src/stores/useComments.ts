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
  cDate: Date;
  setComments: (comments: TComment[]) => void;
  addComments: (comments: TComment[]) => void;
  hasMore: boolean;
}

export const useComments = create<ActionState>()(
  devtools(
    immer((set) => ({
      comments: [],
      cIds: [],
      hasMore: true,
      cDate: new Date(),
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
