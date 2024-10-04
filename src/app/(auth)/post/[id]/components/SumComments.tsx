"use client";

import usePostsStore from "@/stores/Posts";

export default function SumComment() {
  const { post } = usePostsStore();
  return (
    <section className="pb-4">
      <h1 className="text-2xl font-bold">{post?.sumComments} Comments</h1>
    </section>
  );
}
