"use client";

import { actionLikeComment } from "@/lib/next-safe-action/actionLikeComment";
import usePostsStore from "@/stores/Posts";
import { HeartIcon } from "@heroicons/react/24/outline";
import Heart from "@heroicons/react/24/solid/HeartIcon";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";

type Props = {
  isLiked: boolean;
  commentId: string;
};

const ButtonLikeComment = ({ commentId, isLiked }: Props) => {
  const { likeComment } = usePostsStore();
  const pathname = usePathname();
  const like = async () => {
    likeComment(commentId);
    try {
      const result = await actionLikeComment({ commentId, pathname });
      if (result?.serverError) {
        toast.error("Something went wrong");
      }
    } catch (err) {
      likeComment(commentId);
    }
  };
  return (
    <button onClick={like} type="submit">
      {isLiked ? (
        <Heart className="aspect-square w-4 fill-pink-600" />
      ) : (
        <HeartIcon className="aspect-square w-4" />
      )}
    </button>
  );
};

export default ButtonLikeComment;
