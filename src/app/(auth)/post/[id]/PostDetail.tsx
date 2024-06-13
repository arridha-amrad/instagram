"use client";

import PostExpanded from "@/components/PostExpanded";
import { TPost } from "@/fetchings/type";
import { useCommentsStore } from "@/stores/CommentsStore";
import { usePostStore } from "@/stores/PostStore";
import { useEffect } from "react";

type Props = {
  post: TPost;
};

const PostDetail = ({ post }: Props) => {
  const { setComments } = useCommentsStore();
  const { setPosts, posts } = usePostStore();
  useEffect(() => {
    setComments(post.comments);
    setPosts([post]);
  }, []);
  const myPost = posts[0];
  if (!myPost) return null;
  return (
    <div className="mx-6 flex flex-1 basis-0 border border-skin">
      <PostExpanded post={myPost} />
    </div>
  );
};

export default PostDetail;
