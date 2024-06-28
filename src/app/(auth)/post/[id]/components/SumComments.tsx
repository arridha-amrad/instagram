"use client";

import { usePostStore } from "@/stores/PostStore";

export default function SumComment() {
  const { post } = usePostStore();
  return (
    <section className="pb-4">
      <h1 className="text-2xl font-bold">{post?.sumComments} Comments</h1>
    </section>
  );
}
