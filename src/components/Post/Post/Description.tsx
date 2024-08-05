import Avatar from "@/components/Avatar";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";

type Props = {
  avatar?: string | null;
  username: string;
  description: string | null;
  createdAt: Date;
};

const PostDescription = ({
  createdAt,
  description,
  username,
  avatar,
}: Props) => {
  return (
    <section id="post_description" className="flex gap-2">
      <div>
        <Avatar url={avatar} />
      </div>
      <div className="pt-0.5">
        <Link
          href={`/${username}`}
          className="inline pr-2 text-sm font-semibold"
        >
          {username}
        </Link>
        <p className="inline text-sm text-skin-muted">{description}</p>
        <div className="py-2">
          <p className="text-xs text-skin-muted">
            {formatDistanceToNowStrict(createdAt)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PostDescription;
