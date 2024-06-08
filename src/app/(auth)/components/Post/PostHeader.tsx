import Avatar from "@/components/Avatar";
import { TPost } from "../../postsFetching";

type Props = {
  post: TPost;
};

const PostHeader = ({ post }: Props) => {
  return (
    <section className="h-[70px] w-full flex gap-3 items-center">
      <Avatar url={post.owner.avatar} />
      <div>
        <h1 className="font-semibold">{post.owner.username}</h1>
        <p className="text-sm text-skin-muted">{post.location}</p>
      </div>
      <div className="w-1 aspect-square rounded-full bg-neutral-500" />
      <h2 className="text-skin-muted text-sm">3h</h2>
    </section>
  );
};

export default PostHeader;
