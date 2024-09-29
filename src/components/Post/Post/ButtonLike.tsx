"use client";

import { actionLikePost } from "@/lib/next-safe-action/actionLikePost";
import HeartIcon from "@heroicons/react/24/outline/HeartIcon";
import Heart from "@heroicons/react/24/solid/HeartIcon";
import { usePathname } from "next/navigation";

type Props = {
  postId: string;
  isLiked: boolean;
  callback: VoidFunction;
};

export default function ButtonLikePost({ isLiked, postId, callback }: Props) {
  const pathname = usePathname();
  const like = async () => {
    await actionLikePost({ pathname, postId });
    callback();
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
