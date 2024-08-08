"use client";

import Spinner from "@/components/Spinner";
import { TFeedPost, TInfiniteResult } from "@/lib/drizzle/queries/type";
import usePostsStore from "@/stores/Posts";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
  data: TInfiniteResult<TFeedPost>;
};

export default function FeedPostProvider({ children, data }: Props) {
  const { setFeedPosts, isLoadingFeedPosts } = usePostsStore();

  useEffect(() => {
    setFeedPosts(data);
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
