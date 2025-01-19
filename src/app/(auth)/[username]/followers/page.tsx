import PostsProvider from "../PostsProvider";

type Props = {
  params: Promise<{
    username: string;
  }>;
};

export default async function Page({ params }: Props) {
  const username = (await params).username;
  return <PostsProvider username={username} />;
}
