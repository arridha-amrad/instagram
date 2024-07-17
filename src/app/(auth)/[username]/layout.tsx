import { fetchUser } from "@/fetchings/user";
import { Metadata } from "next";
import { ReactNode } from "react";

type Props = {
  params: {
    username: string;
  };
  posts: ReactNode;
  children: ReactNode;
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

const Layout = async ({ posts, children }: Props) => {
  return (
    <main className="w-full py-4">
      {children}
      {posts}
    </main>
  );
};

export default Layout;
