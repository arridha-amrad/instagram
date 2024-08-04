import { auth } from "@/auth";
import Modal from "./Modal";
import { fetchPost } from "@/lib/drizzle/queries/fetchPost";
import PostProvider from "@/components/Providers/PostProvider";

type Props = {
  params: {
    id: string;
  };
};

const Page = async ({ params }: Props) => {
  const session = await auth();

  const post = await fetchPost({
    postId: params.id,
    authUserId: session?.user.id,
  });

  if (!post) {
    return (
      <div>
        <h1>Post not found</h1>
      </div>
    );
  }
  return (
    <PostProvider post={post}>
      <Modal currPathname={`/post/${params.id}`} />
    </PostProvider>
  );
};

export default Page;
