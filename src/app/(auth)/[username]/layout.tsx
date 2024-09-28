import Profile from "@/components/Profile";
import Tabs from "@/components/Tabs";
import db from "@/lib/drizzle/db";
import { UsersTable } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

import { Metadata } from "next";
import { ReactNode } from "react";

type Props = {
  params: {
    username: string;
  };
  children: ReactNode;
  modal: ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [user] = await db
    .select({
      username: UsersTable.username,
      name: UsersTable.name,
    })
    .from(UsersTable)
    .where(eq(UsersTable.username, params.username));
  return {
    title: `${user?.name} (@${params.username}) • Instagram`,
    description: `${params.username} instagram profile page`,
  };
}

const Layout = async ({ children, modal, params }: Props) => {
  return (
    <main className="w-full py-4">
      <Profile username={params.username} />
      <Tabs username={params.username} />
      {children}
      {modal}
    </main>
  );
};

export default Layout;
