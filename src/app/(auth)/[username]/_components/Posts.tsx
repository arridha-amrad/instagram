import Post from "./Post";
import { getUserPosts } from "./fetchUserPosts";

type Props = {
  userId: string;
};

export default async function Posts({ userId }: Props) {
  const posts = await getUserPosts(userId);

  return (
    <section className="grid w-full grid-cols-3 gap-1 pt-20">
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </section>
  );
}
