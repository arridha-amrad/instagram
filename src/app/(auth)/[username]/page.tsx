import { auth } from "@/auth";
import { Metadata } from "next";
import Profile from "./_components/Profile";
import Posts from "./_components/Posts";
import { fetchUser } from "@/fetchings/user";

type Props = {
  params: {
    username: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await fetchUser({
    username: params.username,
  });
  return {
    title: `${user?.name} (@${params.username}) • Instagram`,
    description: `${params.username} instagram profile page`,
  };
}

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
