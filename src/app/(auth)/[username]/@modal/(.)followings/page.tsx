import { auth } from "@/auth";
import ModalBox from "@/components/ModalBox";
import UserWithFollowButtonCard from "@/components/UserCardWithFollowButton";
import { fetchUserFollowings } from "@/lib/drizzle/queries/users/fetchUserFollowings";
import ModalFollowings from "./ModalFollowings";

type Props = {
  params: Promise<{
    username: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const session = await auth();
  const username = (await params).username;

  const data = await fetchUserFollowings({
    authUserId: session?.user.id,
    username,
  });

  return (
    <ModalFollowings>
      <ModalBox title="Followings">
        <div className="max-h-[500px] overflow-y-auto">
          {data.length > 0 ? (
            data.map((user) => (
              <UserWithFollowButtonCard
                sessionUserId={session?.user.id ?? ""}
                key={user.id}
                user={user}
              />
            ))
          ) : (
            <div className="flex items-center justify-center py-4">
              <p className="text-skin-muted">You follow nobody</p>
            </div>
          )}
        </div>
      </ModalBox>
    </ModalFollowings>
  );
};

export default Page;
