"use client";

import { useHomeStore } from "../(home)/_components/store";
import Post from "./Post";

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
