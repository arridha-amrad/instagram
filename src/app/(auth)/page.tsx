import { auth } from "@/auth";
import SuggestedUsers from "./components/SuggestedUsers";
import { fetchPosts } from "@/fetchings/postsFetching";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import Posts from "./components/Posts";
import UserCard from "./components/UserCard";

export const metadata: Metadata = {
  title: "Instagram",
  description: "Home",
};

const Page = async () => {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const {
    user: { username, name, image, id },
  } = session;

  const posts = await fetchPosts(id);

  return (
    <section className="flex w-full">
      <section className="mx-auto min-h-screen w-full max-w-md flex-1">
        <Posts posts={posts} />
      </section>
      <section className="sticky inset-y-0 hidden h-screen min-h-[500px] w-full max-w-xs flex-shrink-0 lg:block">
        <div className="flex items-center">
          <UserCard name={name ?? ""} username={username} avatar={image} />
        </div>
        <div className="h-4" />
        <SuggestedUsers />
      </section>
    </section>
  );
};

export default Page;
