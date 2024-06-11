import Avatar from "../Avatar";
import { formatDistanceToNowStrict } from "date-fns";
import { HeartIcon } from "@heroicons/react/24/outline";
import { TComment } from "@/fetchings/type";
import ButtonLikeComment from "./ButtonLikeComment";

type Props = {
  comment: TComment;
};

const CommentCard = ({ comment }: Props) => {
  return (
    <article className="flex items-start gap-2 w-full">
      <div>
        <Avatar url={comment.owner.avatar} />
      </div>
      <div className="flex-1">
        <div className="pt-0.5 space-x-2 text-sm">
          <h1 className=" inline font-semibold">{comment.owner.username}</h1>
          <p className="inline">{comment.message}</p>
        </div>
        <div className="py-2 flex text-xs text-skin-muted gap-4">
          <div>
            <p className="">{formatDistanceToNowStrict(comment.createdAt)}</p>
          </div>
          {comment.sumLikes > 0 && (
            <div>
              <p>
                {comment.sumLikes} {comment.sumLikes > 1 ? "Likes" : "Like"}
              </p>
            </div>
          )}
          <div>
            <button>Reply</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-[30px] bg-gray-500 h-0.5" />
          <button className="text-xs text-skin-muted">See replies</button>
        </div>
      </div>
      <div className="pt-4">
        <ButtonLikeComment comment={comment} />
      </div>
    </article>
  );
};

export default CommentCard;
