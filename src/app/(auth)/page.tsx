import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SuggestedUsers from "./SuggestedUsers";
import UserCard from "./components/UserCard";
// import { fetchPosts } from "../../fetchings/postsFetching";
import Posts from "./Posts";
import db from "@/lib/drizzle/db";
import { PostsTable, UsersTable } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { fetchPosts2 } from "@/fetchings/posts";

const Page = async () => {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  const {
    user: { username, name, image, id },
  } = session;
  // const posts = await fetchPosts(id);

  await fetchPosts2();

  // const result = await db
  //   .select()
  //   .from(UsersTable)
  //   .innerJoin(sq, eq(UsersTable.id, sq.userId));

  // console.log(JSON.stringify(myPosts, null, 2));

  return <section>ok</section>;

  // return (
  //   <section className="flex w-full">
  //     <section className="flex-1 min-h-screen py-4 max-w-md mx-auto w-full">
  //       <Posts posts={posts} />
  //     </section>
  //     <section className="w-full flex-shrink-0 max-w-xs h-screen min-h-[500px] sticky inset-y-0">
  //       <div className="h-[100px] flex items-center">
  //         <UserCard name={name ?? ""} username={username} avatar={image} />
  //       </div>
  //       <SuggestedUsers />
  //     </section>
  //   </section>
  // );
};

export default Page;
