"use client";

import { TPost } from "@/fetchings/type";
import { ReactNode, useEffect } from "react";
import Spinner from "@/components/Spinner";
import { useHomePageStore } from "@/lib/zustand/homePageStore";

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
  const { setPosts, isLoading } = useHomePageStore();

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

  return <div className="py-4">{children}</div>;
}
