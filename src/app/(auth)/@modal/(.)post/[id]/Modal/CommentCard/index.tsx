import Avatar from "../Avatar";
import { formatDistanceToNowStrict } from "date-fns";
import { TComment } from "@/fetchings/type";
import ButtonLikeComment from "./ButtonLikeComment";
import { useReplySetter } from "@/stores/ReplySetter";
import ShowReplies from "./ShowReplies";
import Replies from "./Replies";
import { useState } from "react";

type Props = {
  comment: TComment;
};

const CommentCard = ({ comment }: Props) => {
  const { setCommentTarget } = useReplySetter();
  const [isShowReplies, setIsShowReplies] = useState(true);
  return (
    <article className="flex items-start gap-2 w-full">
      <div>
        <Avatar url={comment.owner.avatar} />
      </div>
      <div className="flex-1 w-full">
        <div className="flex pt-0.5 w-full">
          <div className="space-x-2 flex-1 basis-0 text-sm">
            <h1 className=" inline font-semibold">{comment.owner.username}</h1>
            <p className="inline">{comment.message}</p>
          </div>
          <div className="w-5 aspect-square flex-none">
            <ButtonLikeComment comment={comment} />
          </div>
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
