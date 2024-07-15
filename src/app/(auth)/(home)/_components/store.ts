import { TComment, TPost } from "@/fetchings/type";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
  posts: TPost[];
  isLoading: boolean;
  page: number;
  total: number;
};

type Action = {
  setPosts: (posts: TPost[]) => void;
  likePost: (postId: string) => void;
  addPost: (post: TPost) => void;
  addComment: (comment: TComment) => void;
};

export const useHomeStore = create<State & Action>()(
  devtools(
    immer((set) => ({
      posts: [],
      isLoading: true,
      page: 0,
      total: 0,
      setPosts(posts) {
        set((state) => {
          state.posts = posts;
          state.isLoading = false;
          state.total = 1;
          state.page = 1;
        });
      },
      likePost(postId) {
        set((state) => {
          const currPost = state.posts.find((p) => p.id === postId);
          if (currPost) {
            if (currPost.isLiked) {
              currPost.isLiked = false;
              currPost.sumLikes -= 1;
            } else {
              currPost.isLiked = true;
              currPost.sumLikes += 1;
            }
          }
        });
      },
      addComment(comment) {
        set((state) => {
          const post = state.posts.find((p) => p.id === comment.postId);
          if (post) {
            post.comments.unshift(comment);
            post.sumComments += 1;
          }
        });
      },
      addPost(post) {
        set((state) => {
          state.posts.unshift(post);
        });
      },
    })),
    {
      anonymousActionType: "useHomeStore",
      name: "Home Store",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);
