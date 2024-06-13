import Avatar from "@/components/Avatar";
import Link from "next/link";

type Props = {
  avatar?: string | null;
  username: string;
  name: string;
};

const UserCard = ({ name, username, avatar }: Props) => {
  return (
    <div className="flex items-center gap-2 px-4 py-3 w-full">
      <div className="flex flex-1 basis-0 items-start justify-start gap-3">
        <Avatar url={avatar} />
        <div className="text-sm max-w-[150px] overflow-hidden">
          <h1 className="font-semibold text-ellipsis whitespace-pre-line overflow-hidden">
            {username}
          </h1>
          <p className="text-skin-muted text-ellipsis">{name}</p>
        </div>
      </div>
      <div className="">
        <Link
          className="text-skin-inverted text-sm font-medium"
          href={`/${username}`}
        >
          visit
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
