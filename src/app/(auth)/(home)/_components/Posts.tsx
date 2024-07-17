"use client";

import Post from "./Post";
import { useHomeStore } from "../../../../lib/zustand/stores/homeStore";

export default function Posts() {
  const { posts } = useHomeStore();

  return (
    <section className="space-y-6">
      {posts.map((post, i) => (
        <Post isFirst={i === 0} post={post} key={i} />
      ))}
    </section>
  );
}
