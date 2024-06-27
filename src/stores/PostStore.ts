import { TComment, TPost } from "@/fetchings/type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";

type State = {
  posts: TPost[];
  isLoadPosts: boolean;
};

type Actions = {
  setPosts: (posts: TPost[]) => void;
  likePost: (postId: string) => void;
  addPost: (post: TPost) => void;
  addComment: (comment: TComment) => void;
};

export const usePostStore = create<State & Actions>()(
  devtools(
    immer((set) => ({
      posts: [],
      isLoadPosts: true,
      addComment(comment) {
        set((state) => {
          const post = state.posts.find((p) => p.id === comment.postId);
          if (post) {
            post.comments.unshift(comment);
            post.sumComments += 1;
          }
        });
      },
      setPosts(posts) {
        set((state) => {
          state.posts = posts;
          state.isLoadPosts = false;
        });
      },
      addPost(post) {
        set((state) => {
          state.posts.unshift(post);
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
    })),
    {
      anonymousActionType: "usePostStore",
      name: "Posts",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);
