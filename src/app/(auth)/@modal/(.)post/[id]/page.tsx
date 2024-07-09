import { fetchComments } from "@/fetchings/comments";
import { auth } from "@/auth";
import Modal from "./Modal";

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
    page: 1,
  });
  return <Modal currPathname={`/post/${params.id}`} comments={comments} />;
};

export default Page;
