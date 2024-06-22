import Post from "@/components/PageProfile/Post";
import { fetchUserPosts } from "@/fetchings/postsFetching";

type Props = {
  userId: string;
};

export default async function Posts({ userId }: Props) {
  const posts = await fetchUserPosts(userId);

  return (
    <section className="grid w-full grid-cols-1 gap-2 pt-10 sm:grid-cols-2 md:gap-3 lg:grid-cols-3">
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </section>
  );
}
