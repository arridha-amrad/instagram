"use client";

import { TPost } from "@/fetchings/type";
import { ReactNode, useEffect } from "react";
import { useHomeStore } from "./store";
import Spinner from "@/components/Spinner";
import ButtonLoadMorePosts from "./LoadMorePosts";

type Data = {
  page: number;
  total: number;
  posts: TPost[];
};

type Props = {
  children: ReactNode;
  data: Data;
};

export default function Provider({ children, data }: Props) {
  const { setPosts, isLoading, total, posts } = useHomeStore();

  useEffect(() => {
    setPosts(data.posts, data.total);
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto flex items-center justify-center py-4">
        <Spinner className="w-7" />
      </div>
    );
  }

  return (
    <>
      {children}
      <div className="py-4">
        {total > posts.length && <ButtonLoadMorePosts />}
      </div>
    </>
  );
}
