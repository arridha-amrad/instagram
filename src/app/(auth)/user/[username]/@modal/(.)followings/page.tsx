import { auth } from "@/auth";
import ModalFollowings from "./ModalFollowings";
import Provider from "./Provider";
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

  console.log(JSON.stringify(data, null, 2));

  return (
    <Provider data={data}>
      <ModalFollowings />
    </Provider>
  );
};

export default Page;
