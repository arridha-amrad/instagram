import { auth } from "@/auth";
import { fetchUserFollowers } from "@/lib/drizzle/queries/fetchUserFollowers";
import ModalFollowers from "./ModalFollowers";

type Props = {
  params: {
    username: string;
  };
};

const Page = async ({ params: { username } }: Props) => {
  const session = await auth();
  const data = await fetchUserFollowers({
    authUserId: session?.user.id,
    username,
  });
  return <ModalFollowers data={data} />;
};

export default Page;
