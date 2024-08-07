import { auth } from "@/auth";
import FeedPosts from "@/components/Post/FeedPosts";
import FeedPostProvider from "@/components/Providers/FeedPostProvider";
import fetchPosts from "@/lib/drizzle/queries/fetchPosts";

export default async function Page() {
  const session = await auth();
  const posts = await fetchPosts({ page: 1, userId: session?.user.id });
  return (
    <FeedPostProvider data={posts}>
      <FeedPosts />
    </FeedPostProvider>
  );
}
