import { TReply } from "@/fetchings/type";
import Avatar from "../Avatar";
import { formatDistanceToNowStrict } from "date-fns";
import { HeartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type Props = {
  replies: TReply[];
};

const Replies = ({ replies }: Props) => {
  return replies.map((r) => (
    <div key={r.id} className="flex items-start gap-4 text-sm w-full">
      <div>
        <Avatar url={r.owner.avatar} />
      </div>
      <div className="flex-1">
        <div className="pt-0.5">
          <h1 className="inline font-semibold">{r.owner.username}</h1>
          <p className="inline pl-1">
            {r.message.split(" ").map((s, i) =>
              s.startsWith("@") ? (
                <Link
                  key={i}
                  className="text-skin-inverted pr-2"
                  href={`/${s.replace("@", "")}`}
                >
                  {s}
                </Link>
              ) : (
                s
              )
            )}
          </p>
        </div>
        <div className="py-2 flex text-xs text-skin-muted gap-4">
          <p className="">{formatDistanceToNowStrict(r.createdAt)}</p>
          {r.sumLikes > 0 && (
            <p>
              {r.sumLikes} {r.sumLikes > 1 ? "likes" : "like"}
            </p>
          )}
        </div>
      </div>
      <button className="pt-1">
        <HeartIcon className="w-4 aspect-square" />
      </button>
    </div>
  ));
};

export default Replies;
