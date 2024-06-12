import { TComment } from "@/fetchings/type";
import { HeartIcon } from "@heroicons/react/24/outline";
import Heart from "@heroicons/react/24/solid/HeartIcon";
import { likeCommentAction } from "./commentAction";
import { useSession } from "next-auth/react";
import { useCommentsStore } from "@/stores/CommentsStore";

type Props = {
  comment: TComment;
};
const ButtonLikeComment = ({ comment }: Props) => {
  const { data } = useSession();
  const { likeComment: lc } = useCommentsStore();
  const likeComment = likeCommentAction.bind(null, {
    commentId: comment.id,
    userId: data?.user.id,
  });
  return (
    <form
      action={(data) => {
        lc(comment.id);
        likeComment(data);
      }}
    >
      <button type="submit">
        {comment.isLiked ? (
          <Heart className="w-4 aspect-square fill-pink-600" />
        ) : (
          <HeartIcon className="w-4 aspect-square" />
        )}
      </button>
    </form>
  );
};

export default ButtonLikeComment;
