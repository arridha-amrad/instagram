import Avatar from "@/components/Avatar";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import { ReactNode, useState } from "react";
import ButtonFetchReplies from "./ButtonFetchReplies";
import ButtonLikeComment from "./ButtonLike";
import Replies from "./Replies";
import ButtonReply from "./ButtonReply";
import { Comment as Tc } from "@/stores/useComments";

type Props = {
  comment: Tc;
  children: ReactNode;
};

const Comment = ({ comment, children }: Props) => {
  const [isShowReplies, setIsShowReplies] = useState(true);

  return (
    <article className="flex w-full items-start gap-2 py-2">
      <div>
        <Avatar url={comment.avatar} />
      </div>
      <div className="flex-1 basis-0 overflow-hidden">
        <div className="flex w-full pt-0.5">
          <div className="flex-1 space-x-2 break-words text-sm">
            <Link
              href={`/${comment.username}`}
              className="inline font-semibold"
            >
              {comment.username}
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
          <p className="">{formatDistanceToNowStrict(comment.createdAt)}</p>
          {comment.sumLikes > 0 && (
            <p>
              {comment.sumLikes} {comment.sumLikes > 1 ? "Likes" : "Like"}
            </p>
          )}
          {children}
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

export default Comment;
