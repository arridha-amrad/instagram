import { auth } from "@/auth";
import Avatar from "@/components/Avatar";
import Button from "@/components/core/Button";
import SvgFemale from "@/components/svg/SvgFemale";
import SvgMale from "@/components/svg/SvgMale";
import { fetchUserProfile } from "@/lib/drizzle/queries/users/fetchUserProfile";
import Link from "next/link";
import Settings from "./Settings";
import ButtonFollow from "@/components/ButtonFollow";
import AvatarEditable from "./AvatarEditable";

type Props = {
  username: string;
};

export default async function Profile({ username }: Props) {
  const session = await auth();
  const u = await fetchUserProfile({
    username,
    authUserId: session?.user.id,
  });

  if (!u) {
    return (
      <div>
        <h1>User not found</h1>
      </div>
    );
  }

  const isAuthUser = session?.user.id === u?.id;

  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center justify-start sm:justify-center">
        {isAuthUser ? (
          <AvatarEditable avatar={u?.avatar} />
        ) : (
          <Avatar className="w-24 sm:w-40" url={u?.avatar} />
        )}
      </div>
      <div className="flex-[2] space-y-4">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl">{u?.username}</h1>
          </div>
          {isAuthUser ? (
            <>
              <Link href="/settings">
                <Button>Edit Profile</Button>
              </Link>
              <Settings />
            </>
          ) : (
            <ButtonFollow
              isFollow={u?.isFollowed ?? false}
              userId={u?.id ?? ""}
            />
          )}
        </div>
        <div className="flex items-center gap-10">
          <div>
            <h1>
              {u?.sumPosts}
              <span className="pl-2">Posts</span>
            </h1>
          </div>

          <Link scroll={false} href={`/${username}/followers`}>
            {u.sumFollowers}
            <span className="pl-2">Followers</span>
          </Link>

          <Link scroll={false} href={`/${username}/followings`}>
            {u.sumFollowings}
            <span className="pl-2">Followings</span>
          </Link>
        </div>
        <div className="spacey-2 text-sm">
          <div className="flex items-center gap-1">
            <h1 className="font-medium">{u?.name}</h1>

            {u.gender === "male" && <SvgMale className="fill-blue-500" />}

            {u.gender === "female" && <SvgFemale className="fill-pink-500" />}
          </div>
          <div className="font-medium text-skin-muted">{u.occupation}</div>
          <div className="whitespace-pre-line">{u.bio}</div>
          <div>
            <a
              target="_blank"
              className="font-semibold text-blue-500"
              href="https://www.google.com"
            >
              {u.website}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
