"use client";

import { TComment } from "@/fetchings/type";
import { useCommentsStore } from "@/stores/CommentsStore";
import { HeartIcon } from "@heroicons/react/24/outline";
import Heart from "@heroicons/react/24/solid/HeartIcon";
import { toast } from "react-toastify";
import { likeCommentAction } from "./action";
import { usePathname } from "next/navigation";

type Props = {
  comment: TComment;
};

const ButtonLikeComment = ({ comment }: Props) => {
  const { likeComment: lc } = useCommentsStore();
  const pathname = usePathname();
  const like = async () => {
    lc(comment.id);
    const result = await likeCommentAction.bind(
      null,
      comment.id,
      pathname,
    )({
      pathname,
    });
    if (result?.serverError) {
      toast.error("Something went wrong");
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
