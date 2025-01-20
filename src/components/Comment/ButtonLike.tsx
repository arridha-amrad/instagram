"use client";

import { useComments } from "@/stores/useComments";
import { HeartIcon } from "@heroicons/react/24/outline";
import Heart from "@heroicons/react/24/solid/HeartIcon";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { likeComment as lc } from "@/lib/actions/comment";

type Props = {
  isLiked: boolean;
  commentId: string;
};

const ButtonLikeComment = ({ commentId, isLiked }: Props) => {
  const pathname = usePathname();
  const { likeComment } = useComments();
  const like = async () => {
    likeComment(commentId);
    try {
      const result = await lc.bind(null, pathname)({ commentId });
      if (result?.serverError) {
        toast.error("Something went wrong");
      }
    } catch (err) {
      likeComment(commentId);
    }
  };
  return (
    <button onClick={like}>
      {isLiked ? (
        <Heart className="aspect-square w-4 fill-pink-600" />
      ) : (
        <HeartIcon className="aspect-square w-4" />
      )}
    </button>
  );
};

export default ButtonLikeComment;
