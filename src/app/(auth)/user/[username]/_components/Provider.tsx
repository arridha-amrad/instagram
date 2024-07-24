"use client";

import Spinner from "@/components/Spinner";
import { TUserPosts } from "@/lib/drizzle/queries/fetchUserPosts";
import useBoundProfileStore from "@/lib/zustand/profilePageStore";
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
    <>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner className="w-6" />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default Provider;
