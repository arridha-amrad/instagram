import Avatar from "@/components/Avatar";
import { TComment } from "@/fetchings/type";
import { useReplySetter } from "@/stores/ReplySetter";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import ButtonFetchReplies from "./ButtonFetchReplies";
import CommentLikeButton from "./CommentLikeButton";
import Replies from "./Replies";

type Props = {
  comment: TComment;
};

const CommentCard = ({ comment }: Props) => {
  const { setCommentTarget } = useReplySetter();
  const [isShowReplies, setIsShowReplies] = useState(true);

  return (
    <article className="flex w-full items-start gap-2 py-2">
      <div>
        <Avatar url={comment.owner.avatar} />
      </div>
      <div className="flex-1 basis-0 overflow-hidden">
        <div className="flex w-full pt-0.5">
          <div className="flex-1 space-x-2 break-words text-sm">
            <Link
              href={`/${comment.owner.username}`}
              className="inline font-semibold"
            >
              {comment.owner.username}
            </Link>
            <p className="inline">{comment.message}</p>
          </div>
          <div className="flex aspect-square w-5 flex-none items-start justify-end">
            <CommentLikeButton comment={comment} />
          </div>
        </div>
        <div className="flex gap-4 py-2 text-xs font-semibold text-skin-muted">
          <div>
            <p className="">{formatDistanceToNowStrict(comment.createdAt)}</p>
          </div>
          {comment.sumLikes > 0 && (
            <p>
              {comment.sumLikes} {comment.sumLikes > 1 ? "Likes" : "Like"}
            </p>
          )}
          <div>
            <button
              onClick={() => {
                setCommentTarget({
                  commentId: comment.id,
                  userId: comment.owner.id,
                  username: comment.owner.username,
                });
              }}
            >
              Reply
            </button>
          </div>
        </div>
        {comment.sumReplies > 0 && (
          <ButtonFetchReplies
            isShowReplies={isShowReplies}
            setIsShowReplies={setIsShowReplies}
            comment={comment}
          />
        )}
        {isShowReplies && <Replies replies={comment.replies} />}
      </div>
    </article>
  );
};

export default CommentCard;
