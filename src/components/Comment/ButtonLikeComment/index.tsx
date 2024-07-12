"use client";

import { TComment } from "@/fetchings/type";
import { useCommentsStore } from "@/stores/CommentsStore";
import { HeartIcon } from "@heroicons/react/24/outline";
import Heart from "@heroicons/react/24/solid/HeartIcon";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { likeCommentAction } from "./action";

type Props = {
  comment: TComment;
};

const ButtonLikeComment = ({ comment }: Props) => {
  const { likeComment: lc } = useCommentsStore();
  const pathname = usePathname();
  const like = async () => {
    lc(comment.id);
    try {
      const result = await likeCommentAction({
        commentId: comment.id,
        pathname,
      });
      if (result?.serverError) {
        toast.error("Something went wrong");
      }
    } catch (err) {
      lc(comment.id);
    }
  };
  return (
    <button onClick={like} type="submit">
      {comment.isLiked ? (
        <Heart className="aspect-square w-4 fill-pink-600" />
      ) : (
        <HeartIcon className="aspect-square w-4" />
      )}
    </button>
  );
};

export default ButtonLikeComment;
