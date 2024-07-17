import { likeCommentAction } from "@/actions/likeCommentAction";
import { TComment } from "@/fetchings/type";
import { useSessionStore } from "@/stores/SessionStore";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as Heart } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState } from "react";

type Props = {
  comment: TComment;
};

const Comment = ({ comment }: Props) => {
  const [isLiked, setLiked] = useState(false);
  const { session } = useSessionStore();

  const like = async () => {
    setLiked((val) => !val);
    await likeCommentAction({
      userId: session?.user.id ?? "",
      commentId: comment.id,
    });
  };

  return (
    <div className="flex items-start justify-between" key={comment.id}>
      <div>
        <Link
          href={`/${comment.owner.username}`}
          className="inline pr-2 text-sm font-semibold"
        >
          {comment.owner.username}
        </Link>
        <p className="inline text-sm text-skin-muted">{comment.message}</p>
      </div>
      <button onClick={like} className="pl-2">
        {isLiked ? (
          <Heart className="w-4 fill-pink-500" />
        ) : (
          <HeartIcon className="w-4" />
        )}
      </button>
    </div>
  );
};

export default Comment;
