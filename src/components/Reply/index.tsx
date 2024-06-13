import Avatar from "@/components/Avatar";
import ButtonLikeReply from "./ButtonLikeReply";
import { TReply } from "@/fetchings/type";
import { formatDistanceToNowStrict } from "date-fns";

type Props = {
  reply: TReply;
};

const Reply = ({
  reply: {
    id,
    owner: { avatar, username },
    sumLikes,
    createdAt,
    message,
  },
}: Props) => {
  return (
    <div className="flex w-full items-start gap-2 text-sm">
      <div>
        <Avatar url={avatar} />
      </div>
      <div className="flex-1 basis-0">
        <div className="text-wrap pt-0.5">
          <h1 className="inline pr-1 font-semibold">{username}</h1>
          <p className="inline text-sm">{message}</p>
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
        <ButtonLikeReply />
      </div>
    </div>
  );
};

export default Reply;
