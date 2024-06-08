import Avatar from "@/components/Avatar";
import Link from "next/link";

type Props = {
  avatar?: string | null;
  username: string;
  name: string;
};

const UserCard = ({ name, username, avatar }: Props) => {
  return (
    <div className="flex justify-between items-center px-4 py-3 w-full">
      <div className="flex items-start justify-start gap-3">
        <Avatar url={avatar} />
        <div className="text-sm">
          <h1 className="font-semibold">{username}</h1>
          <p className="text-skin-muted">{name}</p>
        </div>
      </div>
      <Link
        className="text-skin-inverted text-sm font-medium"
        href={`/${username}`}
      >
        visit
      </Link>
    </div>
  );
};

export default UserCard;
