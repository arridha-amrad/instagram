"use client";

import { TPost } from "@/lib/drizzle/queries/type";
import usePostsStore from "@/stores/Posts";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
  post: TPost;
};

export default function PostProvider({ children, post }: Props) {
  const { setPost } = usePostsStore();

  useEffect(() => {
    setPost(post);
  }, []);

  return children;
}
