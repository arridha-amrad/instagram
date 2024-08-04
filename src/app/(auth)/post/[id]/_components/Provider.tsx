"use client";

import MySpinner from "@/components/Spinner";
import { TFetchComments, TPost } from "@/fetchings/type";
import { useCommentsStore } from "@/stores/CommentsStore";
import usePostsStore from "@/stores/Posts";
import { useReplySetter } from "@/stores/ReplySetter";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
  post: TPost;
  comments: TFetchComments;
};

export default function Provider({ children, post, comments }: Props) {
  const { setPost, isLoadingPost, resetPost } = usePostsStore();
  const { setComments } = useCommentsStore();
  const { reset } = useReplySetter();

  const pathname = usePathname();

  useEffect(() => {
    reset();
    resetPost();
  }, [pathname]);

  useEffect(() => {
    setPost(post);
    setComments(comments.comments, comments.total);
  }, [post, comments]);

  if (isLoadingPost) {
    return (
      <div className="flex justify-start px-4 py-4">
        <MySpinner />
      </div>
    );
  }

  return children;
}
