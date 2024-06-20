import AvatarProfile from "@/components/ProfilePage/AvatarProfile";
import Button from "@/components/core/Button";
import { TProfile } from "@/fetchings/type";
import { CogIcon } from "@heroicons/react/24/outline";
import FormFollow from "./Follow/FomFollow";
import { auth } from "@/auth";

type Props = {
  user: TProfile;
};

export default async function Profile({ user: u }: Props) {
  const data = await auth();
  const isAuthUser = data?.user.id === u?.id;

  return (
    <section className="flex flex-col gap-4 sm:flex-row">
      <div className="flex flex-1 items-center justify-start sm:justify-center">
        <AvatarProfile avatar={u?.avatar} />
      </div>
      <div className="flex-[2] space-y-4">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-lg">{u?.username}</h1>
          </div>
          {isAuthUser ? (
            <Button>Edit Profile</Button>
          ) : (
            <FormFollow
              authId={data?.user.id ?? ""}
              isFollow={u?.isFollowed ?? false}
              userId={u?.id ?? ""}
            />
          )}
          <button>
            <CogIcon className="aspect-square w-6" />
          </button>
        </div>
        <div className="flex items-center gap-10">
          <div>
            <h1>{u?.sumPosts} Posts</h1>
          </div>
          <div>
            <span className="pr-1 font-semibold">{u?.followers} </span>
            Followers
          </div>
          <div>
            <span className="pr-1 font-semibold">{u?.followings} </span>
            Followings
          </div>
        </div>
        <div>
          <h1 className="font-semibold">{u?.username}</h1>
        </div>
      </div>
    </section>
  );
}
