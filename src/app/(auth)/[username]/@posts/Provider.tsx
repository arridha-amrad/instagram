"use client";

import MySpinner from "@/components/_Spinner";
import { TUserPosts } from "@/lib/drizzle/queries/fetchUserPosts";
import useBoundProfileStore from "@/lib/zustand/stores/profilePage";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
  data: TUserPosts;
};

const Provider = ({ children, data }: Props) => {
  const { setPosts, isLoading } = useBoundProfileStore();

  useEffect(() => {
    setPosts(data.posts, data.total);
  }, []);

  if (isLoading) {
    return (
      <div>
        <MySpinner className="w-6" /> set yor post
      </div>
    );
  }

  return children;
};

export default Provider;
