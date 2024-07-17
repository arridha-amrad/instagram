"use client";

import Spinner from "@/components/Spinner";
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

  return (
    <div className="py-20">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner className="w-6" />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default Provider;
