import PostsProvider from "../_components/PostsProvider";

type Props = {
  params: {
    username: string;
  };
};

export default async function Page({ params }: Props) {
  return <PostsProvider username={params.username} />;
}
