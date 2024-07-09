import { followAction } from "@/actions/follow";
import Avatar from "@/components/Avatar";
import { TOwner } from "@/fetchings/type";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/stores/SessionStore";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  user: TOwner;
  isFollow?: boolean;
};

const UserWithFollowButtonCard = ({ user, isFollow: isF = true }: Props) => {
  const [isFollow, setIsFollow] = useState(isF);
  const { session } = useSessionStore();
  const pathname = usePathname();
  const { theme } = useTheme();

  const follow = async () => {
    setIsFollow((val) => !val);
    try {
      await followAction({
        authId: session?.user.id ?? "",
        pathname,
        userId: user.id,
      });
    } catch (err) {
      toast.error("something went wrong", { theme });
    }
  };
  return (
    <div className="flex w-full items-center justify-between px-4 py-3">
      <div className="flex items-start justify-start gap-3">
        <Avatar url={user.avatar} />
        <div className="max-w-[150px] overflow-hidden text-sm">
          <Link
            href={`/${user.username}`}
            className="overflow-hidden text-ellipsis whitespace-pre-line font-semibold"
          >
            {user.username}
          </Link>
          <p className="line-clamp-1 text-skin-muted">{user.name}</p>
        </div>
      </div>
      {session?.user.id !== user.id && (
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
