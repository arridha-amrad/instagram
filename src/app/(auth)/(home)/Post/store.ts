import { TFeedPost } from "@/lib/drizzle/queries/posts/fetchFeedPosts";
import { TInfiniteResult } from "@/lib/drizzle/queries/type";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type TFeedComment = {
  id: string;
  postId: string;
  username: string;
  body: string;
  isLiked: boolean;
};

export type FeedPost = TFeedPost & { comments: TFeedComment[] };

interface Action {
  setPosts: (data: TInfiniteResult<TFeedPost>) => void;
  addPosts: (data: TInfiniteResult<TFeedPost>) => void;
  likePost: (postId: string) => void;
  likeComment: (comment: TFeedComment) => void;
  addComment: (comment: TFeedComment) => void;
}
interface State {
  isLoading: boolean;
  posts: FeedPost[];
  total: number;
  page: number;
  date: Date;
  seenIds: string[];
}

const transform = (posts: TFeedPost[]) => {
  return posts.map((p) => ({ ...p, comments: [] as TFeedComment[] }));
};

const uniquePosts = (currSeenIds: Set<string>, newPosts: FeedPost[]) => {
  const newSeenIds = currSeenIds;
  const posts = [] as FeedPost[];
  for (const post of newPosts) {
    if (!currSeenIds.has(post.id)) {
      posts.push(post);
      newSeenIds.add(post.id);
    }
  }
  return {
    newSeenIds,
    posts,
  };
};

export const useFeedPosts = create<State & Action>()(
  devtools(
    immer((set) => ({
      date: new Date(),
      seenIds: [],
      total: 0,
      page: 0,
      posts: [],
      isLoading: true,
      setPosts({ data, page, total }) {
        set((state) => {
          state.posts = transform(data);
          state.isLoading = false;
          state.date = state.posts[state.posts.length - 1].createdAt;
          state.page = page;
          state.total = total;
          state.seenIds = state.posts.map((p) => p.id);
        });
      },
      addPosts({ data, page }) {
        set((state) => {
          const { newSeenIds, posts } = uniquePosts(
            new Set(state.seenIds),
            transform(data),
          );
          state.posts = [...state.posts, ...posts];
          state.seenIds = Array.from(newSeenIds);
          state.page = page;
          state.date = state.posts[state.posts.length - 1].createdAt;
        });
      },
      likeComment({ id, postId }) {
        set((state) => {
          const post = state.posts.find((p) => p.id === postId);
          if (!post) return;
          const comment = post.comments?.find((c) => c.id === id);
          if (!comment) return;
          comment.isLiked = !comment.isLiked;
        });
      },
      likePost(postId) {
        set((state) => {
          const post = state.posts.find((p) => p.id === postId);
          if (!post) return;
          if (post.isLiked) {
            post.isLiked = false;
            post.sumLikes -= 1;
          } else {
            post.isLiked = true;
            post.sumLikes += 1;
          }
        });
      },
      addComment(comment) {
        set((state) => {
          const post = state.posts.find((p) => p.id === comment.postId);
          if (!post) return;
          post.comments.push(comment);
          post.sumComments += 1;
        });
      },
    })),
    {
      enabled: process.env.NODE_ENV === "development",
      anonymousActionType: "useFeedPosts",
    },
  ),
);
