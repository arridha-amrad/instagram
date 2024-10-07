import CommentsProvider from "@/components/Providers/CommentsProvider";
import { fetchComments } from "@/lib/drizzle/queries/fetchComments";
import { fetchPost } from "@/lib/drizzle/queries/fetchPost";
import { fetchPostMetadata } from "@/lib/drizzle/queries/fetchPostMetadata";
import { getAuth } from "@/lib/next.auth";
import { Metadata } from "next";
import Modal from "./Modal";

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchPostMetadata(params.id);
  return {
    title: `Instagram Post by ${post?.username} added at ${new Intl.DateTimeFormat("en-US").format(post?.createdAt)} • Instagram`,
    description: `Instagram post created by ${post?.username}`,
  };
}

const Page = async ({ params }: Props) => {
  const session = await getAuth();

  const [post, comments] = await Promise.all([
    await fetchPost({
      postId: params.id,
      userId: session?.user.id,
    }),
    await fetchComments({
      postId: params.id,
      userId: session?.user.id,
    }),
  ]);

  if (!post) {
    return (
      <div>
        <h1>Post not found</h1>
      </div>
    );
  }
  return (
    <CommentsProvider total={post.sumComments} data={comments}>
      <Modal post={post} />
    </CommentsProvider>
  );
};

export default Page;
