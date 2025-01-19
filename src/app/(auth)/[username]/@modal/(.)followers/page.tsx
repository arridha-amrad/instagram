import UsersContainer from "@/components/UsersContainer";
import { fetchUserFollowers } from "@/lib/drizzle/queries/users/fetchUserFollowers";
import { getAuth } from "@/lib/next.auth";
import ModalFollowers from "./ModalFollowers";

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
      <UsersContainer
        sessionUserId={session?.user.id ?? ""}
        title="Followers"
        users={data}
      />
    </ModalFollowers>
  );
};

export default Page;
