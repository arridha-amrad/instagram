import { fetchUserPosts } from "@/lib/drizzle/queries/fetchUserPosts";
import UserPosts from "@/components/Post/UserPosts";
import UserPostsProvider from "@/components/Providers/UserPostsProvider";

type Params = {
  username: string;
};

export default async function PostsProvider({ username }: Params) {
  const data = await fetchUserPosts({ username, page: 1 });

  return (
    <UserPostsProvider data={data}>
      <UserPosts />
    </UserPostsProvider>
  );
}
