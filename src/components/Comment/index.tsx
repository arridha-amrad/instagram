import Avatar from "@/components/Avatar";
import { TComment } from "@/fetchings/type";
import { useReplySetter } from "@/stores/ReplySetter";
import { formatDistanceToNowStrict } from "date-fns";
import { useState } from "react";
import CommentLikeButton from "./CommentLikeButton";
import Replies from "./Replies";
import ShowReplies from "./ShowReplies";

type Props = {
  comment: TComment;
};

const CommentCard = ({ comment }: Props) => {
  const { setCommentTarget } = useReplySetter();
  const [isShowReplies, setIsShowReplies] = useState(true);
  return (
    <article className="flex w-full items-start gap-2">
      <div>
        <Avatar url={comment.owner.avatar} />
      </div>
      <div className="w-full flex-1">
        <div className="flex w-full pt-0.5">
          <div className="flex-1 basis-0 space-x-2 text-sm">
            <h1 className="inline font-semibold">{comment.owner.username}</h1>
            <p className="inline">{comment.message}</p>
          </div>
          <div className="aspect-square w-5 flex-none">
            <CommentLikeButton comment={comment} />
          </div>
        </div>
        <div className="flex gap-4 py-2 text-xs text-skin-muted">
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
        <ShowReplies
          isShowReplies={isShowReplies}
          setIsShowReplies={setIsShowReplies}
          comment={comment}
        />
        {isShowReplies && (
          <section>
            <Replies replies={comment.replies} />
          </section>
        )}
      </div>
    </article>
  );
};

export default CommentCard;
