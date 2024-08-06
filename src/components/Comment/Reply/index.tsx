import Avatar from "@/components/Avatar";
import { TReply } from "@/lib/drizzle/queries/type";
import { cn } from "@/lib/utils";
import { useReplySetter } from "@/stores/ReplySetter";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import ButtonLikeReply from "./ButtonLike";

type Props = {
  reply: TReply;
};

const Reply = ({ reply }: Props) => {
  //
  const {
    owner: { avatar, username },
    sumLikes,
    createdAt,
    message,
  } = reply;

  const { setCommentTarget } = useReplySetter();
  return (
    <div className="flex w-full items-start gap-2 py-2 text-sm">
      <Avatar url={avatar} />
      <div className="flex-1 basis-0">
        <div className="text-wrap pt-0.5">
          <Link href={`/${username}`} className="inline pr-1 font-semibold">
            {username}
          </Link>
          <p className="inline space-x-1 break-all text-sm">
            {message.split(" ").map((text, i) =>
              text.startsWith("@") ? (
                <Link
                  key={i}
                  className={cn("font-medium text-blue-500")}
                  href={`/${text.replace("@", "")}`}
                >
                  {` ${text} `}
                </Link>
              ) : (
                ` ${text} `
              ),
            )}
          </p>
        </div>
        <div className="flex gap-4 py-2 text-xs font-semibold text-skin-muted">
          <p className="">{formatDistanceToNowStrict(createdAt)}</p>
          {sumLikes > 0 && (
            <p>
              {sumLikes} {sumLikes > 1 ? "likes" : "like"}
            </p>
          )}
          <button
            onClick={() =>
              setCommentTarget({
                commentId: reply.commentId,
                userId: reply.owner.id,
                username: reply.owner.username,
              })
            }
          >
            Reply
          </button>
        </div>
      </div>
      <div className="pt-1">
        <ButtonLikeReply
          commentId={reply.commentId}
          isLiked={reply.isLiked}
          replyId={reply.id}
        />
      </div>
    </div>
  );
};

export default Reply;
