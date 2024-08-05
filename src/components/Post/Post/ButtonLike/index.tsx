"use client";

import HeartIcon from "@heroicons/react/24/outline/HeartIcon";
import Heart from "@heroicons/react/24/solid/HeartIcon";
import React from "react";

type Props = {
  postId: string;
  isLiked: boolean;
};

export default function ButtonLikePost({ isLiked, postId }: Props) {
  const like = async () => {};
  return (
    <button onClick={like}>
      {isLiked ? (
        <Heart className="aspect-square w-7 fill-green-600" />
      ) : (
        <HeartIcon className="aspect-square w-7" />
      )}
    </button>
  );
}
