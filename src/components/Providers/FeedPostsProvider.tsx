"use client";

import Spinner from "@/components/Spinner";
import { TFeedPost } from "@/lib/drizzle/queries/type";
import usePostsStore from "@/stores/Posts";
import { ReactNode, useEffect } from "react";

type Data = {
  page: number;
  total: number;
  posts: TFeedPost[];
};

type Props = {
  children: ReactNode;
  data: Data;
};

export default function FeedPostProvider({ children, data }: Props) {
  const { setFeedPosts, isLoadingFeedPosts } = usePostsStore();

  useEffect(() => {
    setFeedPosts(data.posts, data.total);
  }, []);

  if (isLoadingFeedPosts) {
    return (
      <div className="mx-auto flex items-center justify-center py-4">
        <Spinner className="w-5" />
      </div>
    );
  }

  return <div className="py-4">{children}</div>;
}
