import PostsProvider from "./PostsProvider";

type Params = {
  params: {
    username: string;
  };
};

export default async function Page({ params: { username } }: Params) {
  return <PostsProvider username={username} />;
}
