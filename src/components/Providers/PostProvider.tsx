"use client";

import Spinner from "@/components/Spinner";
import { TPost } from "@/lib/drizzle/queries/posts/fetchPost";
import usePostsStore from "@/stores/Posts";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
  post: TPost;
};

export default function PostProvider({ children, post }: Props) {
  const { setPost, isLoadingPost } = usePostsStore();

  useEffect(() => {
    setPost(post);
  }, []);

  if (isLoadingPost) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return children;
}
