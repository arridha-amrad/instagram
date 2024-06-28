"use client";

import MySpinner from "@/components/Spinner";
import { TComment, TPost } from "@/fetchings/type";
import { useCommentsStore } from "@/stores/CommentsStore";
import { usePostStore } from "@/stores/PostStore";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
  post: TPost;
  comments: TComment[];
};

export default function Provider({ children, post, comments }: Props) {
  const { setPost, post: pst } = usePostStore();
  const { setComments } = useCommentsStore();

  useEffect(() => {
    setPost(post);
    setComments(comments);
  }, [post, comments]);

  if (!pst) {
    return (
      <div>
        <MySpinner />
      </div>
    );
  }

  return children;
}
