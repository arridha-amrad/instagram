import Avatar from "@/components/Avatar";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import ButtonFetchReplies from "./ButtonFetchReplies";
import ButtonLikeComment from "./ButtonLike";
import Replies from "./Replies";
import { TComment } from "@/lib/drizzle/queries/type";
import ButtonReply from "./ButtonReply";

type Props = {
  comment: TComment;
};

const CommentCard = ({ comment }: Props) => {
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
            <ButtonLikeComment
              commentId={comment.id}
              isLiked={comment.isLiked}
            />
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
            <ButtonReply
              commentId={comment.id}
              username={comment.owner.username}
            />
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
