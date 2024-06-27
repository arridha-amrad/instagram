import Avatar from "@/components/Avatar";
import ButtonLikeReply from "./ButtonLikeReply";
import { TReply } from "@/fetchings/type";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  reply: TReply;
};

const Reply = ({ reply }: Props) => {
  const {
    owner: { avatar, username },
    sumLikes,
    createdAt,
    message,
  } = reply;
  return (
    <div className="flex w-full items-start gap-2 text-sm">
      <div>
        <Avatar url={avatar} />
      </div>
      <div className="flex-1 basis-0">
        <div className="text-wrap pt-0.5">
          <Link href={`/${username}`} className="inline pr-1 font-semibold">
            {username}
          </Link>
          {/* <p className="inline break-all text-sm">{message}</p> */}
          <p className="inline space-x-1 break-all text-sm">
            {message.split(" ").map((text, i) =>
              text.startsWith("@") ? (
                <Link
                  className={cn(
                    i === 0 ? "pr-px" : "pl-px",
                    "text-skin-inverted",
                  )}
                  href={`/${text.replace("@", "")}`}
                >
                  {text}
                </Link>
              ) : (
                <span className={cn(i === 0 ? "pr-px" : "pl-px")}>{text}</span>
              ),
            )}
          </p>
        </div>
        <div className="flex gap-4 py-2 text-xs text-skin-muted">
          <p className="">{formatDistanceToNowStrict(createdAt)}</p>
          {sumLikes > 0 && (
            <p>
              {sumLikes} {sumLikes > 1 ? "likes" : "like"}
            </p>
          )}
        </div>
      </div>
      <div className="pt-1">
        <ButtonLikeReply reply={reply} />
      </div>
    </div>
  );
};

export default Reply;
