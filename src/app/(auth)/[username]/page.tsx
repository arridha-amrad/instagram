import Profile from "@/components/ProfilePage";
import Posts from "@/components/ProfilePage/Posts";
import { fetchUser } from "@/fetchings/user";
import { auth } from "@/auth";

type Props = {
  params: {
    username: string;
  };
};

const Page = async ({ params }: Props) => {
  const session = await auth();
  const user = await fetchUser({
    username: params.username,
    authUserId: session?.user.id,
  });

  if (!user) {
    return (
      <div>
        <h1>Oops, User not found</h1>
      </div>
    );
  }

  return (
    <main className="w-full py-4">
      <Profile user={user} />
      {user.id && <Posts userId={user.id} />}
    </main>
  );
};

export default Page;
