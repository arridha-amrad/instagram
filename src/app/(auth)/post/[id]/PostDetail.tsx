"use client";

import PostExpanded from "@/components/PostExpanded";
import { TComment } from "@/fetchings/type";
import { useCommentsStore } from "@/stores/CommentsStore";
import { usePostStore } from "@/stores/PostStore";
import { useEffect } from "react";

type Props = {
  comments: TComment[];
};

const PostDetail = ({ comments }: Props) => {
  const { setComments } = useCommentsStore();
  const { posts } = usePostStore();

  useEffect(() => {
    setComments(comments);
  }, [comments]);

  if (!posts[0]) return null;

  return (
    <div className="mx-6 flex flex-1 basis-0 border border-skin">
      <PostExpanded post={posts[0]} />
    </div>
  );
};

export default PostDetail;
