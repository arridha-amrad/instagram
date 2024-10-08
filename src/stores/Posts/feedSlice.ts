import {
  TFeedComment,
  TFeedPost,
  TInfiniteResult,
} from "@/lib/drizzle/queries/type";
import { StateCreator } from "zustand";
import { DetailSlice } from "./detailSlice";
import { UserSlice } from "./userSlice";

export type FeedSlice = {
  totalFeedPosts: number;
  pageFeedPosts: number;
  lastPostDate: Date;
  isLoadingFeedPosts: boolean;
  feedPosts: TFeedPost[];
  likeFeedPost: (postId: string) => void;
  setFeedPosts: (data: TInfiniteResult<TFeedPost>) => void;
  addFeedPosts: (feedPosts: TFeedPost[]) => void;
  addCommentToFeedPost: (comment: TFeedComment) => void;
  likeCommentOfFeedPost: (postId: string, commentId: string) => void;
};

export const createFeedSlice: StateCreator<
  DetailSlice & FeedSlice & UserSlice,
  [["zustand/devtools", never], ["zustand/immer", never]],
  [],
  FeedSlice
> = (set) => ({
  lastPostDate: new Date(),
  feedPosts: [],
  pageFeedPosts: 0,
  totalFeedPosts: 0,
  isLoadingFeedPosts: true,
  likeCommentOfFeedPost(postId, commentId) {
    set((state) => {
      const comment = state.feedPosts
        .find((p) => p.id === postId)
        ?.comments.find((c) => c.id === commentId);
      if (!comment) return;
      comment.isLiked = !comment.isLiked;
    });
  },
  addCommentToFeedPost(comment) {
    set((state) => {
      const post = state.feedPosts.find((p) => p.id === comment.postId);
      if (post) {
        post.comments.push(comment);
        post.sumComments += 1;
      }
    });
  },

  likeFeedPost(postId) {
    set((state) => {
      const post = state.feedPosts.find((p) => p.id === postId);
      if (!post) return;
      post.sumLikes = post.isLiked ? post.sumLikes - 1 : post.sumLikes + 1;
      post.isLiked = !post.isLiked;
    });
  },
  addFeedPosts(feedPosts) {
    set((state) => {
      state.feedPosts = [...state.feedPosts, ...feedPosts].filter(
        (p, i, arr) => arr.findIndex((v) => v.id === p.id) === i,
      );
      state.pageFeedPosts += 1;
      state.lastPostDate = feedPosts[feedPosts.length - 1].createdAt;
    });
  },
  setFeedPosts(data) {
    set((state) => {
      state.feedPosts = data.data;
      state.pageFeedPosts = 1;
      state.totalFeedPosts = data.total;
      state.isLoadingFeedPosts = false;
      state.lastPostDate = data.data[data.data.length - 1].createdAt;
    });
  },
});
