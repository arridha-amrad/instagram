import {
  TComment,
  TInfiniteResult,
  TPost,
  TReply,
} from "@/lib/drizzle/queries/type";
import { StateCreator } from "zustand";
import { FeedSlice } from "./feedSlice";
import { UserSlice } from "./userSlice";

export type DetailSlice = {
  isLoadingPost: boolean;
  post: TPost | null;
  setPost: (post: TPost) => void;
  resetPost: () => void;
  likePost: () => void;
  likeComment: (commentId: string) => void;
  likeReply: (commentId: string, replyId: string) => void;
  addMoreComments: (data: TInfiniteResult<TComment>) => void;
  addComment: (comment: TComment) => void;
  addReply: (commentId: string, reply: TReply) => void;
};

export const createDetailSlice: StateCreator<
  DetailSlice & FeedSlice & UserSlice,
  [["zustand/devtools", never], ["zustand/immer", never]],
  [],
  DetailSlice
> = (set) => ({
  post: null,
  isLoadingPost: true,
  addReply(commentId, reply) {
    set((state) => {
      const post = state.post;
      if (!post) return;
      const comment = post.comments.data.find((c) => c.id === commentId);
      if (!comment) return;
      comment.replies.data.unshift(reply);
      comment.replies.total += 1;
    });
  },
  addComment(newComment) {
    set((state) => {
      const post = state.post;
      if (!post) return;
      post.comments.data.unshift(newComment);
      post.comments.total += 1;
    });
  },
  likeReply(commentId, replyId) {
    set((state) => {
      const post = state.post;
      if (!post) return;
      const comment = post.comments.data.find((c) => c.id === commentId);
      if (!comment) return;
      const reply = comment.replies.data.find((r) => r.id === replyId);
      if (!reply) return;
      reply.sumLikes = reply.isLiked
        ? (reply.sumLikes -= 1)
        : (reply.sumLikes += 1);
      reply.isLiked = !reply.isLiked;
    });
  },
  likePost() {
    set((state) => {
      const post = state.post;
      if (!post) return;
      post.sumLikes = post.isLiked
        ? (post.sumLikes -= 1)
        : (post.sumLikes += 1);
      post.isLiked = !post.isLiked;
    });
  },
  likeComment(commentId) {
    set((state) => {
      const post = state.post;
      if (!post) return;
      const comment = post.comments.data.find((c) => c.id === commentId);
      if (!comment) return;
      comment.sumLikes = comment.isLiked
        ? (comment.sumLikes -= 1)
        : (comment.sumLikes += 1);
      comment.isLiked = !comment.isLiked;
    });
  },
  resetPost() {
    set((state) => {
      state.isLoadingPost = true;
      state.post = null;
    });
  },
  setPost(post) {
    set((state) => {
      state.post = post;
      state.isLoadingPost = false;
    });
  },
  addMoreComments(data) {
    set((state) => {
      const post = state.post;
      if (!post) return;
      const newComments = [...post.comments.data, ...data.data].filter(
        (v, i, arr) => arr.findIndex((a) => a.id === v.id) === i,
      );
      post.comments = {
        data: newComments,
        page: data.page,
        total: data.total,
      };
    });
  },
});
