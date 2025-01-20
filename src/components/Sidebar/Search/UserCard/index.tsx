"use client";

import Avatar from "@/components/Avatar";
import { saveUserToSearchHistory } from "@/lib/actions/user";
import { TSearchUser } from "@/lib/drizzle/queries/type";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import ButtonRemove from "./ButtonRemove";

type Props = {
  user: TSearchUser;
  isRemovable: boolean;
};

const UserCard = ({
  user: { avatar, name, username, id },
  isRemovable,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = async () => {
    await saveUserToSearchHistory.bind(
      null,
      pathname,
    )({
      searchId: id,
    });
    router.push(`/${username}`);
  };

  return (
    <div
      onClick={navigate}
      className="flex cursor-pointer gap-3 rounded-md px-2 py-2 hover:bg-skin-fill/20"
    >
      <div className="flex-none">
        <Avatar url={avatar} />
      </div>
      <div className="flex-1 text-sm">
        <h1>{username}</h1>
        <p className="text-skin-muted">{name}</p>
      </div>
      {isRemovable && <ButtonRemove userId={id} />}
    </div>
  );
};

export default UserCard;
