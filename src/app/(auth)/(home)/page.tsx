import { auth } from "@/auth";
import FeedPosts from "@/components/Post/FeedPosts";
import FeedPostProvider from "@/components/Providers/FeedPostsProvider";
import { fetchFeedPosts } from "@/lib/drizzle/queries/fetchFeedPosts";

export default async function Page() {
  const session = await auth();
  const posts = await fetchFeedPosts({ page: 1, userId: session?.user.id });
  return (
    <FeedPostProvider data={posts}>
      <FeedPosts />
    </FeedPostProvider>
  );
}
