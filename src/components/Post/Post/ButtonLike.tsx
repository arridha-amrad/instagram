"use client";

import { actionLikePost } from "@/lib/next-safe-action/actionLikePost";
import HeartIcon from "@heroicons/react/24/outline/HeartIcon";
import Heart from "@heroicons/react/24/solid/HeartIcon";
import { usePathname } from "next/navigation";

type Props = {
  postId: string;
  total?: number;
  isLiked: boolean;
  callback: VoidFunction;
};

export default function ButtonLikePost({
  isLiked,
  total,
  postId,
  callback,
}: Props) {
  const pathname = usePathname();
  const like = async () => {
    await actionLikePost({ pathname, postId });
    callback();
  };
  return (
    <button className="inline-flex items-center gap-2" onClick={like}>
      {isLiked ? (
        <Heart className="aspect-square w-7 fill-pink-600" />
      ) : (
        <HeartIcon className="aspect-square w-7" />
      )}
      {total && total > 0 && (
        <span className="text-2xl font-medium">{total} likes</span>
      )}
    </button>
  );
}
