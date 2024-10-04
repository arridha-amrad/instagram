"use client";

import { useComments } from "@/stores/useComments";

export default function SumComments() {
  const { total } = useComments();
  return (
    <section className="pb-4">
      <h1 className="text-2xl font-bold">{total} Comments</h1>
    </section>
  );
}
