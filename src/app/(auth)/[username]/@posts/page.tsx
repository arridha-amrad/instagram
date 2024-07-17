import { getUserPosts } from "@/lib/drizzle/queries/fetchUserPosts";
import Provider from "./Provider";
import Posts from "./Posts";

type Params = {
  params: {
    username: string;
  };
};

export default async function Page({ params: { username } }: Params) {
  const data = await getUserPosts({ username, page: 1 });

  return (
    <Provider data={data}>
      <Posts />
    </Provider>
  );
}
