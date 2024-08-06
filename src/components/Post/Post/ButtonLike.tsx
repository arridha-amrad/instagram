"use client";

import { actionLikePost } from "@/lib/next-safe-action/actionLikePost";
import usePostsStore from "@/stores/Posts";
import HeartIcon from "@heroicons/react/24/outline/HeartIcon";
import Heart from "@heroicons/react/24/solid/HeartIcon";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  postId: string;
  isLiked: boolean;
};

export default function ButtonLikePost({ isLiked, postId }: Props) {
  const { likePost } = usePostsStore();
  const pathname = usePathname();
  const like = async () => {
    likePost();
    try {
      await actionLikePost({ pathname, postId });
    } catch (err) {
      likePost();
    }
  };
  return (
    <button onClick={like}>
      {isLiked ? (
        <Heart className="aspect-square w-7 fill-pink-600" />
      ) : (
        <HeartIcon className="aspect-square w-7" />
      )}
    </button>
  );
}
