import { auth } from "@/auth";
import Posts from "../_components/Posts";
import { fetchPosts } from "../_components/fetchPosts";

export default async function Page() {
  const session = await auth();
  const posts = await fetchPosts(session?.user.id);
  return <Posts posts={posts} />;
}
