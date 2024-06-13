"use client";

import { useEffect } from "react";
import Post from "./Post";
import MySpinner from "@/components/Spinner";
import { TPost } from "@/fetchings/type";
import { usePostStore } from "@/stores/PostStore";

type Props = {
  posts: TPost[];
};

export default function Posts({ posts }: Props) {
  const { setPosts, posts: ps, isLoadPosts } = usePostStore();

  useEffect(() => {
    setPosts(posts);
  }, []);

  if (isLoadPosts) {
    return (
      <div className="py-10">
        <MySpinner />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {ps.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </section>
  );
}
