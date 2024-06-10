import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { TComment, TPost } from "../../fetchings/postsFetching";

type State = {
  posts: TPost[];
  isLoadPosts: boolean;
};

type Actions = {
  setPosts: (posts: TPost[]) => void;
  likePost: (post: TPost) => void;
  addComment: (comment: TComment) => void;
};

export const usePostStore = create<State & Actions>()(
  immer((set) => ({
    posts: [],
    isLoadPosts: true,
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
            currPost.likes -= 1;
          } else {
            currPost.isLiked = true;
            currPost.likes += 1;
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
