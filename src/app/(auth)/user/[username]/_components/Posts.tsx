"use client";

import Post from "./Post";
import useBoundProfileStore from "@/lib/zustand/profilePageStore";

export default function Posts() {
  const posts = useBoundProfileStore((state) => state.posts);

  return (
    <section className="grid w-full grid-cols-3 gap-1">
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </section>
  );
}
