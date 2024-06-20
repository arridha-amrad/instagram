import AvatarProfile from "@/components/ProfilePage/AvatarProfile";
import Button from "@/components/core/Button";
import { TProfile } from "@/fetchings/type";
import { CogIcon } from "@heroicons/react/24/outline";

type Props = {
  user: TProfile;
};

export default async function Profile({ user }: Props) {
  return (
    <section className="flex flex-col gap-4 sm:flex-row">
      <div className="flex flex-1 items-center justify-start sm:justify-center">
        <AvatarProfile avatar={user.avatar} />
      </div>
      <div className="flex-[2] space-y-4">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-lg">{user.username}</h1>
          </div>
          <Button>Edit Profile</Button>
          <button>
            <CogIcon className="aspect-square w-6" />
          </button>
        </div>
        <div className="flex items-center gap-10">
          <div>
            <h1>{user.sumPosts} Posts</h1>
          </div>
          <div>
            <h1>1 Follower</h1>
          </div>
          <div>
            <h1>1 Following</h1>
          </div>
        </div>
        <div>
          <h1 className="font-semibold">{user.username}</h1>
        </div>
      </div>
    </section>
  );
}
