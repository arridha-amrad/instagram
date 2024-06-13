import Avatar from "@/components/Avatar";
import { TPost } from "@/fetchings/type";
import { formatDistanceToNowStrict } from "date-fns";

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
        <h1 className="inline pr-2 text-sm font-semibold">
          {post.owner.username}
        </h1>
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
