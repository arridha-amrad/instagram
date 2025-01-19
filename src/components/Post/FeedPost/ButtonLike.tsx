"use client";

import { likePost as lp } from "@/lib/actions/post";
import { showToast } from "@/lib/utils";
import { useFeedPosts } from "@/stores/useFeedPosts";
import HeartIcon from "@heroicons/react/24/outline/HeartIcon";
import Heart from "@heroicons/react/24/solid/HeartIcon";
import { usePathname } from "next/navigation";

type Props = {
  isLiked: boolean;
  postId: string;
};

export default function ButtonLike({ isLiked, postId }: Props) {
  const { likePost } = useFeedPosts();
  const pathname = usePathname();
  const like = async () => {
    likePost(postId);
    try {
      await lp.bind(null, pathname)({ postId });
    } catch (err) {
      showToast("something went wrong", "error");
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
