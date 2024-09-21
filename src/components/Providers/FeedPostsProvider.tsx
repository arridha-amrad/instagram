"use client";

import Spinner from "@/components/Spinner";
import { TFeedPost } from "@/lib/drizzle/queries/fetchFeedPosts";
import { TInfiniteResult } from "@/lib/drizzle/queries/type";
import { useFeedPosts } from "@/stores/useFeedPosts";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
  data: TInfiniteResult<TFeedPost>;
};

export default function FeedPostProvider({ children, data }: Props) {
  const { setPosts, isLoading } = useFeedPosts();

  useEffect(() => {
    setPosts(data);
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto flex items-center justify-center py-4">
        <Spinner className="w-5" />
      </div>
    );
  }

  return <div className="py-4">{children}</div>;
}
