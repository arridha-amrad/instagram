import Avatar from "@/components/Avatar";
import { TPost } from "@/fetchings/type";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";

type Props = {
  post: TPost;
};

const Owner = ({ post }: Props) => {
  return (
    <section className="flex w-full items-center gap-3 text-sm">
      <Avatar className="w-9" url={post.owner.avatar} />
      <div>
        <Link
          href={`/user/${post.owner.username}`}
          className="font-semibold hover:underline"
        >
          {post.owner.username}
        </Link>
        <p className="text-skin-muted">{post.location}</p>
      </div>
      <div className="aspect-square w-1 rounded-full bg-neutral-500" />
      <p className="text-skin-muted">
        {formatDistanceToNowStrict(post.createdAt)}
      </p>
    </section>
  );
};

export default Owner;
