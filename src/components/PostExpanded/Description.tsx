import Avatar from "@/components/Avatar";
import { TPost } from "@/fetchings/type";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";

type Props = {
  post: TPost;
};

const PostDescription = ({ post }: Props) => {
  return (
    <section id="post_description" className="flex gap-2">
      <div>
        <Avatar url={post.owner.avatar} />
      </div>
      <div className="pt-0.5">
        <Link
          href={`/${post.owner.username}`}
          className="inline pr-2 text-sm font-semibold"
        >
          {post.owner.username}
        </Link>
        <p className="inline text-sm text-skin-muted">{post.description}</p>
        <div className="py-2">
          <p className="text-xs text-skin-muted">
            {formatDistanceToNowStrict(post.createdAt)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PostDescription;
