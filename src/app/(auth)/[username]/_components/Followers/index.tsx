import { auth } from "@/auth";
import { fetchUserFollowers } from "@/lib/drizzle/queries/fetchUserFollowers";
import ModalFollowers from "./ModalFollowers";

type Props = {
  userId: string;
  total: number;
};

export default async function Followers({ total, userId }: Props) {
  const session = await auth();
  const users = await fetchUserFollowers({
    userId,
    authUserId: session?.user.id,
  });

  return <ModalFollowers followers={users} total={total} />;
}
