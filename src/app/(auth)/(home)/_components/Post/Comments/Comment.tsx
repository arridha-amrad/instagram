import { likeCommentAction } from "@/actions/likeCommentAction";
import { TComment } from "@/fetchings/type";
import { useSessionStore } from "@/lib/zustand/sessionStore";
import usePostsStore from "@/stores/Posts";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as Heart } from "@heroicons/react/24/solid";
import Link from "next/link";

type Props = {
  comment: TComment;
};

const Comment = ({ comment }: Props) => {
  const { likeCommentOfFeedPost } = usePostsStore();
  const { session } = useSessionStore();

  const like = async () => {
    likeCommentOfFeedPost(comment.postId, comment.id);
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
        {comment.isLiked ? (
          <Heart className="w-4 fill-pink-500" />
        ) : (
          <HeartIcon className="w-4" />
        )}
      </button>
    </div>
  );
};

export default Comment;
