import Avatar from "@/components/Avatar";

import { cn, showToast } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import ButtonLikeReply from "./ButtonLike";
import ButtonReply from "./ButtonReply";
import { TReply } from "@/lib/drizzle/queries/replies/fetchReplies";
import { useState } from "react";
import FormReply from "../FormReply";
import { likeReply as lr } from "@/lib/actions/reply";
import { useComments } from "@/stores/useComments";
import { usePathname } from "next/navigation";
import ButtonLike from "@/components/ButtonLike";

type Props = {
  reply: TReply;
  showForm?: boolean;
};

const Reply = ({ reply, showForm }: Props) => {
  const { avatar, username, sumLikes, createdAt, message, commentId } = reply;
  const [isShow, setIsShow] = useState(false);
  const { likeReply } = useComments();
  const pathname = usePathname();

  const like = async () => {
    likeReply(commentId, reply.id);
    try {
      await lr.bind(null, pathname)({ replyId: reply.id });
    } catch (err) {
      showToast("Something went wrong", "error");
    }
  };

  return (
    <div className="flex w-full items-start gap-4 py-2 text-sm">
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
          {showForm ? (
            <button onClick={() => setIsShow((val) => !val)}>Reply</button>
          ) : (
            <ButtonReply commentId={commentId} username={username} />
          )}
        </div>
        {isShow && (
          <FormReply
            commentId={commentId}
            setIsShow={setIsShow}
            username={username}
          />
        )}
      </div>
      <div className="pt-1">
        <ButtonLike callback={like} isLike={reply.isLiked} size="small" />
      </div>
    </div>
  );
};

export default Reply;
