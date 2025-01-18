import { fetchUserFollowers } from "@/lib/drizzle/queries/users/fetchUserFollowers";
import ModalFollowers from "./ModalFollowers";
import { getAuth } from "@/lib/next.auth";
import UsersContainer from "@/components/UsersContainer";

type Props = {
  params: {
    username: string;
  };
};

const Page = async ({ params: { username } }: Props) => {
  const session = await getAuth();
  const data = await fetchUserFollowers({
    authUserId: session?.user.id,
    username,
  });
  return (
    <ModalFollowers>
      <UsersContainer
        sessionUserId={session?.user.id ?? ""}
        title="Followers"
        users={data}
      />
    </ModalFollowers>
  );
};

export default Page;
