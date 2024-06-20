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
  });
  return <Modal comments={comments} />;
};

export default Page;
