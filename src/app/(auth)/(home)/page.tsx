import { auth } from "@/auth";
import Posts from "./_components/Posts";
import Provider from "./_components/Provider";
import fetchPosts from "@/lib/drizzle/queries/fetchPosts";

export default async function Page() {
  const session = await auth();
  const posts = await fetchPosts({ page: 1, userId: session?.user.id });
  return (
    <Provider data={posts}>
      <Posts />
    </Provider>
  );
}
