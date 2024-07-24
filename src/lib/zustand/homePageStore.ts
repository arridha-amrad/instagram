import { TComment, TPost } from "@/fetchings/type";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
  posts: TPost[];
  isLoading: boolean;
  page: number;
  total: number;
  isFetching: boolean;
};

type Action = {
  setPosts: (posts: TPost[], total: number) => void;
  setPage: (page: number) => void;
  setIsFetching: (val: boolean) => void;
  addPosts: (posts: TPost[]) => void;
  likePost: (postId: string) => void;
  addPost: (post: TPost) => void;
  addComment: (comment: TComment) => void;
};

export const useHomePageStore = create<State & Action>()(
  devtools(
    immer((set) => ({
      isFetching: false,
      posts: [],
      isLoading: true,
      page: 0,
      total: 0,
      setPage(page) {
        set((state) => {
          state.page = page;
        });
      },
      setIsFetching(val) {
        set((state) => {
          state.isFetching = val;
        });
      },
      addPosts(posts) {
        set((state) => {
          state.posts = [...state.posts, ...posts].filter(
            (v, i, arr) => arr.findIndex((val) => val.id === v.id) === i,
          );
          state.page += 1;
        });
      },
      setPosts(posts, total) {
        set((state) => {
          state.posts = posts;
          state.isLoading = false;
          state.total = total;
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
          state.total += 1;
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
