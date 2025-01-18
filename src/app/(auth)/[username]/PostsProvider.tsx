import { fetchUserPosts } from "@/lib/drizzle/queries/posts/fetchUserPosts";
import UserPosts from "@/components/Post/UserPosts";

type Params = {
  username: string;
};

export default async function PostsProvider({ username }: Params) {
  const data = await fetchUserPosts({ username });
  return <UserPosts initData={data} />;
}
