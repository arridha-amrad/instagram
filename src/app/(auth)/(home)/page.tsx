import { auth } from "@/auth";
import Posts from "./Posts";
import { fetchFeedPosts } from "@/lib/drizzle/queries/posts/fetchFeedPosts";
import { redirect } from "next/navigation";
import FeedPostProvider from "./Post/PostsProvider";

export default async function Page() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    redirect("/login");
  }

  const posts = await fetchFeedPosts({ page: 1, userId });

  return (
    <FeedPostProvider data={posts}>
      <Posts sessionUserId={session.user.id ?? ""} />
    </FeedPostProvider>
  );
}
