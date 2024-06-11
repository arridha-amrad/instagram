import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SuggestedUsers from "./SuggestedUsers";
import UserCard from "./components/UserCard";
import Posts from "./Posts";
import { cache } from "react";
import { fetchPosts } from "@/fetchings/postsFetching";

const Page = async () => {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  const {
    user: { username, name, image, id },
  } = session;

  const posts = await cache(fetchPosts)(id);

  return (
    <section className="flex w-full">
      <section className="flex-1 min-h-screen py-4 max-w-md mx-auto w-full">
        <Posts posts={posts} />
      </section>
      <section className="w-full flex-shrink-0 max-w-xs h-screen min-h-[500px] sticky inset-y-0">
        <div className="h-[100px] flex items-center">
          <UserCard name={name ?? ""} username={username} avatar={image} />
        </div>
        <SuggestedUsers />
      </section>
    </section>
  );
};

export default Page;
