import { auth } from "@/auth";
import Posts from "../_components/Posts";
import { fetchPosts } from "../_components/fetchPosts";
import Provider from "./_components/Provider";

export default async function Page() {
  const session = await auth();
  const posts = await fetchPosts({ page: 1, userId: session?.user.id });
  return (
    <Provider data={posts}>
      <Posts />
    </Provider>
  );
}
