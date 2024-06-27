import Avatar from "@/components/Avatar";
import { TPost } from "@/fetchings/type";
import Link from "next/link";

type Props = {
  post: TPost;
};

const PostOwner = ({ post }: Props) => {
  return (
    <section id="post_owner" className="px-4 py-2">
      <div className="flex items-center gap-3">
        <Avatar url={post.owner.avatar} />
        <div>
          <Link
            href={`/${post.owner.username}`}
            className="text-sm font-semibold"
          >
            {post.owner.username}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PostOwner;
