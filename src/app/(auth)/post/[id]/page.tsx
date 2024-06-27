import { auth } from "@/auth";
import { fetchComments } from "@/fetchings/comments";
import PostDetail from "./PostDetail";

type Props = {
  params: {
    id: string;
  };
};

const Page = async ({ params }: Props) => {
  const session = await auth();
  const comments = await fetchComments({
    postId: params.id,
    userId: session?.user.id,
  });
  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      <PostDetail comments={comments} />
    </main>
  );
};

export default Page;
