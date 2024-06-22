import AvatarProfile from "@/components/PageProfile/AvatarProfile";
import { TProfile } from "@/fetchings/type";
import FormFollow from "./Follow/FomFollow";
import { auth } from "@/auth";
import EditProfile from "./FormEditProfile";
import SvgMale from "../svg/SvgMale";
import SvgFemale from "../svg/SvgFemale";
import Avatar from "../Avatar";
import Settings from "./Settings";

type Props = {
  user: TProfile;
};

export default async function Profile({ user: u }: Props) {
  const data = await auth();
  const isAuthUser = data?.user.id === u?.id;

  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center justify-start sm:justify-center">
        {isAuthUser ? (
          <AvatarProfile avatar={u?.avatar} />
        ) : (
          <Avatar className="w-24 lg:w-40" url={u?.avatar} />
        )}
      </div>
      <div className="flex-[2] space-y-4">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl">{u?.username}</h1>
          </div>
          {isAuthUser ? (
            <EditProfile user={u} />
          ) : (
            <FormFollow
              authId={data?.user.id ?? ""}
              isFollow={u?.isFollowed ?? false}
              userId={u?.id ?? ""}
            />
          )}
          <Settings />
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
        <div className="spacey-2 text-sm">
          <div className="flex items-center gap-1">
            <h1 className="font-medium">{u?.name}</h1>

            {u?.userInfo?.gender === "male" && (
              <SvgMale className="fill-blue-500" />
            )}

            {u?.userInfo?.gender === "female" && (
              <SvgFemale className="fill-pink-500" />
            )}
          </div>
          <div className="font-medium text-skin-muted">
            {u?.userInfo?.occupation}
          </div>
          <div className="whitespace-pre-line">{u?.userInfo?.bio}</div>
          <div>
            <a
              target="_blank"
              className="font-semibold text-blue-500"
              href="https://www.google.com"
            >
              {u?.userInfo?.website}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
