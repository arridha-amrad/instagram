"use client";

import { actionLikePost } from "@/lib/next-safe-action/actionLikePost";
import HeartIcon from "@heroicons/react/24/outline/HeartIcon";
import Heart from "@heroicons/react/24/solid/HeartIcon";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Props = {
  postId: string;
  total: number;
  isLiked: boolean;
};

export default function ButtonLikePost({ isLiked, total, postId }: Props) {
  const pathname = usePathname();
  const [isL, setIsL] = useState(isLiked);
  const [tot, setTot] = useState(total);
  const like = async () => {
    setTot((val) => (isL ? (val -= 1) : (val += 1)));
    setIsL((val) => !val);
    await actionLikePost({ pathname, postId });
  };
  return (
    <button className="inline-flex items-center gap-2" onClick={like}>
      {isL ? (
        <Heart className="aspect-square w-7 fill-pink-600" />
      ) : (
        <HeartIcon className="aspect-square w-7" />
      )}
      {total > 0 && <span className="text-2xl font-semibold">{tot} likes</span>}
    </button>
  );
}
