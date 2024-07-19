"use client";

import Post from "./_components/Post";
import useBoundProfileStore from "@/lib/zustand/stores/profilePage";

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
