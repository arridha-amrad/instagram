"use client";

import MySpinner from "@/components/Spinner";
import { TPost } from "@/fetchings/type";
import { useEffect } from "react";
import Post from "./Post";
import { usePostStore } from "@/stores/PostStore";

type Props = {
  posts: TPost[];
};

export default function Posts({ posts }: Props) {
  const { isLoadPosts, posts: ps, setPosts } = usePostStore();

  useEffect(() => {
    setPosts(posts);
  }, [posts]);

  if (isLoadPosts) {
    return (
      <div className="py-10">
        <MySpinner />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {ps.map((post, i) => (
        <Post isFirst={i === 0} post={post} key={post.id} />
      ))}
    </section>
  );
}
