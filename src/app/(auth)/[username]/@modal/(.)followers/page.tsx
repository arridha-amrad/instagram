import { fetchUserFollowers } from "@/lib/drizzle/queries/users/fetchUserFollowers";
import { getAuth } from "@/lib/next.auth";
import ModalFollowers from "./ModalFollowers";
import ModalBox from "@/components/ModalBox";
import UserWithFollowButtonCard from "@/components/UserCardWithFollowButton";

type Props = {
  params: Promise<{
    username: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const username = (await params).username;
  const session = await getAuth();
  const data = await fetchUserFollowers({
    authUserId: session?.user.id,
    username,
  });
  return (
    <ModalFollowers>
      <ModalBox title="Followers">
        <>
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
              <p className="text-skin-muted">You have no followers</p>
            </div>
          )}
        </>
      </ModalBox>
    </ModalFollowers>
  );
};

export default Page;
