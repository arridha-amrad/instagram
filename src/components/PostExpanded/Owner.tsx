import Avatar from "@/components/Avatar";
import { TUser } from "@/lib/drizzle/queries/type";
import Link from "next/link";

type Props = {
  user: TUser;
};

const PostOwner = ({ user }: Props) => {
  return (
    <section id="post_owner" className="px-4 py-2">
      <div className="flex items-center gap-3">
        <Avatar url={user.avatar} />
        <div>
          <Link href={`/${user.username}`} className="text-sm font-semibold">
            {user.username}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PostOwner;
