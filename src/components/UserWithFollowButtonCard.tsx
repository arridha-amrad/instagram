import Avatar from "@/components/Avatar";
import { TFollow } from "@/lib/drizzle/queries/fetchUserFollowers";

import { actionFollowUser } from "@/lib/next-safe-action/actionFollowUser";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  user: TFollow;
  sessionUserId: string;
};

const UserWithFollowButtonCard = ({
  user: { avatar, id, isFollow: isF, name, username },
  sessionUserId,
}: Props) => {
  const [isFollow, setIsFollow] = useState(isF);
  const pathname = usePathname();
  const { theme } = useTheme();

  const follow = async () => {
    setIsFollow((val) => !val);
    try {
      await actionFollowUser({
        pathname,
        followId: id,
      });
    } catch (err) {
      toast.error("something went wrong", { theme });
    }
  };
  return (
    <div className="flex w-full items-center justify-between px-4 py-3">
      <div className="flex items-start justify-start gap-3">
        <Avatar url={avatar} />
        <div className="max-w-[150px] overflow-hidden text-sm">
          <Link
            href={`/${username}`}
            className="overflow-hidden text-ellipsis whitespace-pre-line font-semibold"
          >
            {username}
          </Link>
          <p className="line-clamp-1 text-skin-muted">{name}</p>
        </div>
      </div>
      {sessionUserId !== id && (
        <button
          onClick={follow}
          className={cn(
            "w-28 rounded-md border-skin py-1 text-sm font-semibold",
            isFollow ? "border text-skin-muted" : "bg-skin-fill text-skin-base",
          )}
        >
          {isFollow ? "following" : "follow"}
        </button>
      )}
    </div>
  );
};

export default UserWithFollowButtonCard;
