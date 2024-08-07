import { getUserPosts } from "@/lib/drizzle/queries/fetchUserPosts";
import Posts from "./Posts";
import UserPostsProvider from "@/components/Providers/UserPostsProvider";

type Params = {
  username: string;
};

export default async function PostsProvider({ username }: Params) {
  const data = await getUserPosts({ username, page: 1 });

  return (
    <UserPostsProvider data={data}>
      <Posts />
    </UserPostsProvider>
  );
}
