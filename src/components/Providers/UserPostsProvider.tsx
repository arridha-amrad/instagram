"use client";

import Spinner from "@/components/Spinner";
import { TInfiniteResult, TUserPost } from "@/lib/drizzle/queries/type";
import usePostsStore from "@/stores/Posts";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
  data: TInfiniteResult<TUserPost>;
};

const UserPostsProvider = ({ children, data }: Props) => {
  const { setUserPosts, isLoadingUserPosts } = usePostsStore();

  useEffect(() => {
    setUserPosts(data.data, data.total);
  }, []);

  if (isLoadingUserPosts) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="w-6" />
      </div>
    );
  }

  return children;
};

export default UserPostsProvider;
