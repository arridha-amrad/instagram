import { TComment } from "@/app/(auth)/postsFetching";
import Avatar from "../Avatar";
import { formatDistanceToNowStrict } from "date-fns";
import { HeartIcon } from "@heroicons/react/24/outline";

type Props = {
  comment: TComment;
};

const CommentCard = ({ comment }: Props) => {
  return (
    <article className="flex items-start gap-2">
      <div>
        <Avatar url={comment.owner.avatar} />
      </div>
      <div className="flex-1">
        <div className="pt-1.5 space-x-2 ">
          <h1 className="text-sm inline font-semibold">
            {comment.owner.username}
          </h1>
          <p className="inline">{comment.message}</p>
        </div>
        <div className="pt-1">
          <p className="text-xs text-skin-muted">
            {formatDistanceToNowStrict(comment.createdAt)}
          </p>
        </div>
      </div>
      <div className="pt-4">
        <button>
          <HeartIcon className="w-4 aspect-square" />
        </button>
      </div>
    </article>
  );
};

export default CommentCard;
