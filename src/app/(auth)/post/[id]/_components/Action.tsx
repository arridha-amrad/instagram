"use client";

import ButtonLikePost from "@/components/ButtonLikePost";
import usePostsStore from "@/stores/Posts";

export default function Action() {
  const { post } = usePostsStore();
  if (!post) return null;
  return (
    <section className="flex items-center gap-2 py-4">
      <ButtonLikePost post={post} />
      <h1>
        <span className="text-xl font-semibold">{post.sumLikes}</span>{" "}
        {post.sumLikes > 1 ? "Likes" : "Like"}
      </h1>
    </section>
  );
}
