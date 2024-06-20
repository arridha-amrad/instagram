import Avatar from "@/components/Avatar";
import { TPost } from "@/fetchings/type";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";

type Props = {
  post: TPost;
};

const PostHeader = ({ post }: Props) => {
  return (
    <section className="flex h-[70px] w-full items-center gap-3">
      <Avatar url={post.owner.avatar} />
      <div>
        <Link
          href={`/${post.owner.username}`}
          className="font-semibold hover:underline"
        >
          {post.owner.username}
        </Link>
        <p className="text-sm text-skin-muted">{post.location}</p>
      </div>
      <div className="aspect-square w-1 rounded-full bg-neutral-500" />
      <h2 className="text-sm text-skin-muted">
        {formatDistanceToNowStrict(post.createdAt)}
      </h2>
    </section>
  );
};

export default PostHeader;
