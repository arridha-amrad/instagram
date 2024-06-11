import { TComment, TPost } from "@/fetchings/type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  posts: TPost[];
  isLoadPosts: boolean;
};

type Actions = {
  setPosts: (posts: TPost[]) => void;
  likePost: (post: TPost) => void;
  addComment: (comment: TComment) => void;
  setComment: (postId: string, comments: TComment[]) => void;
  likeComment: (postId: string, commentId: string) => void;
};

export const usePostStore = create<State & Actions>()(
  immer((set) => ({
    posts: [],
    isLoadPosts: true,
    likeComment(postId, commentId) {
      set((state) => {
        const post = state.posts.find((p) => p.id === postId);
        if (!post) return;
        const comment = post.comments.find((c) => c.id === commentId);
        if (!comment) return;
        if (comment.isLiked) {
          comment.isLiked = false;
          comment.sumLikes -= 1;
        } else {
          (comment.isLiked = true), (comment.sumLikes += 1);
        }
      });
    },
    setComment(postId, comments) {
      set((state) => {
        const post = state.posts.find((p) => p.id === postId);
        if (!post) return;
        post.comments = comments;
      });
    },
    setPosts(posts) {
      set((state) => {
        state.posts = posts;
        state.isLoadPosts = false;
      });
    },
    likePost(post) {
      set((state) => {
        const currPost = state.posts.find((p) => p.id === post.id);
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
        const currPost = state.posts.find((p) => p.id === comment.postId);
        if (currPost) {
          currPost.comments.splice(0, 0, comment);
          currPost.sumComments += 1;
        }
      });
    },
  }))
);
