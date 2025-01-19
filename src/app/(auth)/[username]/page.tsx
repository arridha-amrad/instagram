import PostsProvider from "./PostsProvider";

type Params = {
  params: Promise<{
    username: string;
  }>;
};

export default async function Page({ params }: Params) {
  const username = (await params).username;
  return <PostsProvider username={username} />;
}
