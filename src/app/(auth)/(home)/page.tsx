import { auth } from "@/auth";
import FeedPosts from "@/components/Post/FeedPosts";
import FeedPostProvider from "@/components/Providers/FeedPostsProvider";
import { fetchFeedPosts } from "@/lib/drizzle/queries/fetchFeedPosts";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) {
    redirect("/login");
  }
  const posts = await fetchFeedPosts({ page: 1, userId });
  return (
    <FeedPostProvider data={posts}>
      <FeedPosts />
    </FeedPostProvider>
  );
}
