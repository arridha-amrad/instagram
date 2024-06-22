import Post from "@/components/PageProfile/Post";
import { fetchUserPosts } from "@/fetchings/postsFetching";

type Props = {
  userId: string;
};

export default async function Posts({ userId }: Props) {
  const posts = await fetchUserPosts(userId);

  return (
    <section className="grid w-full grid-cols-3 gap-3 pt-10">
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </section>
  );
}
