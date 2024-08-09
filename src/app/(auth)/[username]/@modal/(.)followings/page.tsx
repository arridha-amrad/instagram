import { auth } from "@/auth";
import ModalFollowings from "./ModalFollowings";
import { fetchUserFollowings } from "@/lib/drizzle/queries/fetchUserFollowings";

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

  return <ModalFollowings data={data} />;
};

export default Page;
