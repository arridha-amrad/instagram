import { fetchUser } from "@/fetchings/user";
import { Metadata } from "next";
import { ReactNode } from "react";
import UserProfile from "./_components/UserProfile";

type Props = {
  params: {
    username: string;
  };
  children: ReactNode;
  modal: ReactNode;
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

const Layout = async ({ children, modal, params }: Props) => {
  return (
    <main className="w-full py-4">
      <UserProfile username={params.username} />
      {children}
      {modal}
    </main>
  );
};

export default Layout;
