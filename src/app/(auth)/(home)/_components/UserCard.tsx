import Avatar from "@/components/Avatar";
import Link from "next/link";

type Props = {
  avatar?: string | null;
  username: string;
  name: string;
};

const UserCard = ({ name, username, avatar }: Props) => {
  return (
    <div className="flex w-full items-center gap-2 px-4 py-3">
      <div className="flex flex-1 basis-0 items-start justify-start gap-3">
        <Avatar url={avatar} />
        <div className="max-w-[150px] overflow-hidden text-sm">
          <h1 className="overflow-hidden text-ellipsis whitespace-pre-line font-semibold">
            {username}
          </h1>
          <p className="line-clamp-1 text-skin-muted">{name}</p>
        </div>
      </div>
      <div className="">
        <Link
          className="text-sm font-medium text-skin-inverted"
          href={`/${username}`}
        >
          visit
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
