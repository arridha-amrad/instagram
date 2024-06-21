import Avatar from "@/components/Avatar";
import Link from "next/link";
import { removeFromHistories, saveSearchUser } from "./action";
import { useRef } from "react";
import { useSession } from "next-auth/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
  username: string;
  avatar: string | null;
  name: string;
  userId: string;
};

const UserCard = ({ avatar, name, username, userId }: Props) => {
  const { data } = useSession();
  const authId = data?.user.id;

  const action = saveSearchUser.bind(null, {
    searchId: userId,
    userId: authId ?? "",
  });

  const deleteAction = removeFromHistories.bind(null, {
    searchId: userId,
    userId: authId ?? "",
  });

  const btnRef = useRef<HTMLButtonElement | null>(null);
  return (
    <div className="flex gap-3 rounded-md px-2 py-2 hover:bg-skin-fill/20">
      <div className="flex-none">
        <Avatar url={avatar} />
      </div>
      <div className="flex-1 text-sm">
        <form action={action}>
          <Link
            className="font-medium hover:underline"
            onClick={() => {
              btnRef.current?.click();
            }}
            href={`/${username}`}
          >
            {username}
          </Link>
          <button ref={btnRef} hidden type="submit" />
        </form>
        <p className="text-skin-muted">{name}</p>
      </div>
      <form action={deleteAction}>
        <button type="submit" className="flex-none">
          <XMarkIcon className="aspect-square w-5" />
        </button>
      </form>
    </div>
  );
};

export default UserCard;
