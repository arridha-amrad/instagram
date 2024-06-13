import Avatar from "@/components/Avatar";
import { TPost } from "@/fetchings/type";

type Props = {
  post: TPost;
};

const PostOwner = ({ post }: Props) => {
  return (
    <section id="post_owner" className="border-b border-skin px-4 py-2">
      <div className="flex items-center gap-3">
        <Avatar url={post.owner.avatar} />
        <div>
          <h1 className="text-sm font-semibold">{post.owner.username}</h1>
        </div>
      </div>
    </section>
  );
};

export default PostOwner;
