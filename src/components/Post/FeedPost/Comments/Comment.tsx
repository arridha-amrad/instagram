import { actionLikeComment } from "@/lib/next-safe-action/actionLikeComment";
import { FeedComment, useFeedPosts } from "@/stores/useFeedPosts";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as Heart } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  comment: FeedComment;
};

const Comment = ({ comment }: Props) => {
  const { likeComment } = useFeedPosts();
  const pathname = usePathname();

  const like = async () => {
    likeComment(comment);
    await actionLikeComment({
      pathname,
      commentId: comment.id,
    });
  };

  return (
    <div className="flex items-start justify-between" key={comment.id}>
      <div>
        <Link
          href={`/user/${comment.username}`}
          className="inline pr-2 text-sm font-semibold"
        >
          {comment.username}
        </Link>
        <p className="inline text-sm text-skin-muted">{comment.body}</p>
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
