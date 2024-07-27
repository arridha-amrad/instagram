import { TPost } from "@/lib/drizzle/queries/type";
import { StateCreator } from "zustand";
import { DetailSlice } from "./detailSlice";
import { ProfileSlice } from "./profileSlice";

export type FeedSlice = {
  totalFeedPosts: number;
  pageFeedPosts: number;
  feedPosts: TPost[];
  isLoadingFeedPosts: boolean;
  likeFeedPost: (postId: string) => void;
  setFeedPosts: (posts: TPost[], total: number) => void;
  addFeedPosts: (feedPosts: TPost[]) => void;
};

export const createFeedSlice: StateCreator<
  DetailSlice & FeedSlice & ProfileSlice,
  [["zustand/devtools", never], ["zustand/immer", never]],
  [],
  FeedSlice
> = (set) => ({
  feedPosts: [],
  pageFeedPosts: 0,
  totalFeedPosts: 0,
  isLoadingFeedPosts: true,
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
    });
  },
  setFeedPosts(posts, total) {
    set((state) => {
      state.feedPosts = posts;
      state.pageFeedPosts = 1;
      state.totalFeedPosts = total;
      state.isLoadingFeedPosts = false;
    });
  },
});
