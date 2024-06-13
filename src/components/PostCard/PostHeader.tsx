import Avatar from "@/components/Avatar";

import Image from "next/image";
import Default from "@/images/default.jpg";
import { TPost } from "@/fetchings/type";
import { formatDistanceToNowStrict } from "date-fns";
type Props = {
  post: TPost;
};

const PostHeader = ({ post }: Props) => {
  return (
    <section className="flex h-[70px] w-full items-center gap-3">
      {post.owner.avatar ? (
        <Avatar url={post.owner.avatar} />
      ) : (
        <div className="aspect-square w-12 overflow-hidden rounded-full border border-skin">
          <Image
            className="h-full w-full object-cover"
            alt="avatar"
            width={100}
            height={100}
            loading="lazy"
            src={Default}
          />
        </div>
      )}
      <div>
        <h1 className="font-semibold">{post.owner.username}</h1>
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
