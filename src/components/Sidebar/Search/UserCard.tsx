import Avatar from "@/components/Avatar";
import Link from "next/link";
import { saveSearchUser } from "./action";
import { useRef } from "react";
import { useSession } from "next-auth/react";

type Props = {
  closeModal: VoidFunction;
  username: string;
  avatar: string | null;
  name: string;
  userId: string;
};

const UserCard = ({ avatar, closeModal, name, username, userId }: Props) => {
  const { data } = useSession();
  const authId = data?.user.id;
  if (!authId) {
    return null;
  }
  const action = saveSearchUser.bind(null, {
    searchId: userId,
    userId: authId,
  });
  const btnRef = useRef<HTMLButtonElement | null>(null);
  return (
    <form action={action}>
      <Link
        onClick={() => {
          btnRef.current?.click();
          closeModal();
        }}
        href={`/${username}`}
      >
        <div className="flex gap-2 rounded-md px-2 py-2 hover:bg-skin-fill/20">
          <div className="flex-none">
            <Avatar url={avatar} />
          </div>
          <div className="text-sm">
            <h1 className="font-medium">{username}</h1>
            <p className="text-skin-muted">{name}</p>
          </div>
        </div>
      </Link>
      <button ref={btnRef} hidden type="submit" />
    </form>
  );
};

export default UserCard;
