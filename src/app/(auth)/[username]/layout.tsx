import Profile from "@/components/Profile";
import Tabs from "@/components/Tabs";
import fetchUserMetadata from "@/lib/drizzle/queries/users/fetchUserMetadata";

import { Metadata } from "next";
import { ReactNode } from "react";

type Props = {
  params: Promise<{ username: string }>;
  children: ReactNode;
  modal: ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const username = (await params).username;
  const user = await fetchUserMetadata(username);
  return {
    title: `${user?.name} (@${user.username}) • Instagram`,
    description: `${user.username} instagram profile page`,
  };
}

const Layout = async ({ children, modal, params }: Props) => {
  const username = (await params).username;
  return (
    <main className="w-full py-4">
      <Profile username={username} />
      <Tabs username={username} />
      {children}
      {modal}
    </main>
  );
};

export default Layout;
