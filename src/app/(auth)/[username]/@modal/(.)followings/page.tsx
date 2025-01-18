import { auth } from "@/auth";
import ModalFollowings from "./ModalFollowings";
import { fetchUserFollowings } from "@/lib/drizzle/queries/users/fetchUserFollowings";
import UsersContainer from "@/components/UsersContainer";

type Props = {
  params: {
    username: string;
  };
};

const Page = async ({ params: { username } }: Props) => {
  const session = await auth();

  const data = await fetchUserFollowings({
    authUserId: session?.user.id,
    username,
  });

  return (
    <ModalFollowings>
      <UsersContainer
        title="Followings"
        users={data}
        sessionUserId={session?.user.id ?? ""}
      />
    </ModalFollowings>
  );
};

export default Page;
