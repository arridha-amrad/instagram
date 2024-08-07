"use client";

import Avatar from "@/components/Avatar";
import { TOwner } from "@/lib/drizzle/queries/type";
import { actionFollowUser } from "@/lib/next-safe-action/actionFollowUser";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  user: TOwner;
};

const SuggestedUser = ({ user: { name, username, avatar, id } }: Props) => {
  const pathname = usePathname();
  const [isFollow, setFollow] = useState(false);
  const follow = async () => {
    setFollow((val) => !val);
    try {
      await actionFollowUser({
        pathname,
        followId: id,
      });
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="flex w-full items-center justify-between px-4">
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
      <button
        onClick={follow}
        className={cn(
          "text-sm font-semibold",
          isFollow ? "text-skin-muted" : "text-skin-inverted",
        )}
      >
        {isFollow ? "unFollow" : "follow"}
      </button>
    </div>
  );
};

export default SuggestedUser;
