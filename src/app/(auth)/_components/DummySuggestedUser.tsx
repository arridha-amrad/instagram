import Avatar from "@/components/Avatar";
import Link from "next/link";

type Props = {
  avatar?: string | null;
  username: string;
  name: string;
};

const DummySuggestedUser = ({ name, username, avatar }: Props) => {
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
      <button className="text-sm font-medium text-skin-inverted">follow</button>
    </div>
  );
};

export default DummySuggestedUser;
