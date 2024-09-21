"use client";

import { actionLikePost } from "@/lib/next-safe-action/actionLikePost";
import { useFeedPosts } from "@/stores/useFeedPosts";
import HeartIcon from "@heroicons/react/24/outline/HeartIcon";
import Heart from "@heroicons/react/24/solid/HeartIcon";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";

type Props = {
  isLiked: boolean;
  postId: string;
};

export default function ButtonLike({ isLiked, postId }: Props) {
  const { likePost } = useFeedPosts();
  const { theme } = useTheme();
  const pathname = usePathname();
  const like = async () => {
    likePost(postId);
    try {
      await actionLikePost({ pathname, postId });
    } catch (err) {
      toast.error("Something went wrong", { theme });
      // to cancel prev optimistic update
      likePost(postId);
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
