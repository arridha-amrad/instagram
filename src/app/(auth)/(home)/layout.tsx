import { auth } from "@/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import UserCard from "../_components/UserCard";

export const metadata: Metadata = {
  title: "Instagram",
  description: "Home",
};

type Props = {
  children: ReactNode;
  suggestedUsers: ReactNode;
};

const Layout = async ({ children, suggestedUsers }: Props) => {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const {
    user: { username, name, image },
  } = session;

  return (
    <section className="flex w-full">
      <section className="mx-auto min-h-screen w-full max-w-md flex-1">
        {children}
      </section>
      <section className="sticky inset-y-0 hidden h-screen min-h-[500px] w-full max-w-xs flex-shrink-0 lg:block">
        <div className="flex items-center">
          <UserCard name={name ?? ""} username={username} avatar={image} />
        </div>
        <div className="h-4" />
        {suggestedUsers}
      </section>
    </section>
  );
};

export default Layout;
